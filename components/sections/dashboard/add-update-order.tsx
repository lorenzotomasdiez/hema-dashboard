"use client";

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateOrderType, Order } from "@/app/api/orders/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/app/api/clients/schema";
import { getClients } from "@/services/clients";
import { createOrder, updateOrder } from "@/services/orders";
import { toast } from "sonner";

interface AddUpdateOrderProps {
  order?: Order;
  queryKey: (string | number)[];
  open: boolean;
  setOpen: (open: number | null) => void;
}

export default function AddUpdateOrder({ order, queryKey, open, setOpen }: AddUpdateOrderProps) {
  const queryClient = useQueryClient();

  const clients = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: getClients
  })

  const addOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrderType) => createOrder({
      ...orderData,
      quantity: Number(orderData.quantity)
    }),
    mutationKey: ["addOrder"],
    onMutate: async (orderData: CreateOrderType) => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previousOrders = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: CreateOrderType[]) => [{ ...orderData, createdAt: new Date().toISOString(), id: new Date().getTime() }, ...old]);
      return { previousOrders }
    },
    onError: (err, _order, context) => {
      console.error(err);
      queryClient.setQueryData(queryKey, context?.previousOrders)
    }
  })

  const updateOrderMutation = useMutation({
    mutationFn: (orderData: Order) => updateOrder(orderData.id, {
      ...orderData,
      quantity: Number(orderData.quantity)
    }),
    mutationKey: ["updateOrder"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success("Pedido actualizado correctamente!");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Error al actualizar el pedido");
    }
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
    setValue,
    reset,
  } = useForm<CreateOrderType>({
    defaultValues: {
      clientId: order?.clientId || undefined,
      deliveredAt: order?.deliveredAt || undefined,
      quantity: order?.quantity || 0,
      type: order?.type || "KG3",
      status: order?.status || "PENDING"
    }
  })

  const onSubmit = async (data: CreateOrderType) => {
    setOpen(null);
    if (order) {
      console.log(order, data);
      updateOrderMutation.mutateAsync({ ...order, ...data }).then(() => {
        reset();
      });
    } else {
      addOrderMutation.mutateAsync(data).then((res) => {
        if (!res.success) {
          console.error(res);
          return;
        }
        toast.success("Pedido creado correctamente!");
        reset();
      });
    }
  }

  return (
    <Dialog open={!!open} onOpenChange={(e) => setOpen(!!e ? (order?.id || 0) : null)}>
      <DialogTrigger hidden={!!order}>
        <Button>Agregar Pedido</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{order ? "Actualizar Pedido" : "Agregar Pedido"}</DialogTitle>
            <DialogDescription>
              {order
                ? "Actualiza los detalles del pedido. Click en 'Actualizar' cuando hayas terminado."
                : "Completa los detalles para el nuevo pedido. Click en 'Agregar' cuando hayas terminado."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo
              </Label>
              <Select
                name="type"
                value={watch('type')}
                onValueChange={
                  (e: CreateOrderType['type']) => setValue('type', e)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KG3">3KG</SelectItem>
                  <SelectItem value="KG5">5KG</SelectItem>
                  <SelectItem value="KG10">10KG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Cantidad
              </Label>
              <Input
                type="number"
                id="quantity"
                className="col-span-3"
                {...register("quantity")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientId" className="text-right">
                Clientes
              </Label>
              <Select
                name="clientId"
                value={watch('clientId')}
                onValueChange={
                  (e: CreateOrderType['clientId']) => setValue('clientId', e)
                }
                disabled={!clients.data || clients.data.length === 0}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={
                    (!clients.data || clients.data.length === 0) ? "No hay clientes" : "Selecciona un cliente"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {
                    clients.data && clients.data.length > 0 && clients.data.map((client) => (
                      <SelectItem value={client.id} key={client.id}>
                        {client.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Estado
            </Label>
            <Select
              name="status"
              value={watch('status')}
              onValueChange={
                (e) => setValue('status', e as CreateOrderType['status'])
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="SHIPPED">En camino</SelectItem>
                <SelectItem value="DELIVERED">Entregado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 mt-10">
            <Button type="submit" disabled={isSubmitting}>
              {order ? "Actualizar Pedido" : "Agregar Pedido"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}