"use client";

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
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
import { CreateOrderType, GetOrdersParams, GetOrdersResponse, Order } from "@/types/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { getClients } from "@/services/clients";
import { createOrder, updateOrder } from "@/services/orders";
import { toast } from "sonner";
import { CompleteOrderProduct } from "@/prisma/zod";
import { CalendarIcon, Minus, Plus } from "lucide-react";
import { QUERY_KEYS } from "@/lib/tanstack";
import { RHFDatePicker } from "@/components/rhf/rhf-date-picker";
import { Form } from "@/components/ui/form";
import { useEffect } from "react";
import { calculatePrice, cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Product } from "@prisma/client";

interface AddUpdateOrderProps {
  order?: Order & { products: CompleteOrderProduct[] };
  queryKey: readonly ["orders", { readonly state: GetOrdersParams }];
  open: boolean;
  setOpen: (open: number | null) => void;
  productsData?: Product[];
}

export default function AddUpdateOrder({ order, queryKey, open, setOpen, productsData }: AddUpdateOrderProps) {
  const queryClient = useQueryClient();

  const clients = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: getClients
  })

  const addOrderMutation = useMutation({
    mutationKey: ["addOrder"],
    mutationFn: (orderData: CreateOrderType) => createOrder({
      ...orderData,
    }),
    onMutate: async (orderData: CreateOrderType) => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previousOrders = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(
        queryKey,
        (old: GetOrdersResponse) => {
          return {
            ...old,
            orders: [
              {
                ...orderData,
                createdAt: new Date().toISOString(),
                id: new Date().getTime(),
              },
              ...old.orders
            ],
            total: old.ordersCount + 1
          }
        }
      );
      return { previousOrders }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Pedido creado correctamente!");
    },
    onError: (_err, _order, context) => {
      queryClient.setQueryData(queryKey, context?.previousOrders)
      toast.error("Error al crear el pedido");
    },
    onSettled: (_data, error) => {
      if (error) {
        console.log(error);
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.summary });
      queryClient.invalidateQueries({ queryKey });
    }
  })

  const updateOrderMutation = useMutation({
    mutationKey: ["updateOrder"],
    mutationFn: (orderData: Order) => updateOrder(orderData.id, {
      ...orderData,
    }),
    onMutate: async (orderData: Order) => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previousOrders = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: GetOrdersResponse) => {
        return {
          ...old,
          orders: old.orders.map(o => o.id === orderData.id ? orderData : o)
        }
      });
      return { previousOrders }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success("Pedido actualizado correctamente!");
    },
    onError: (_err, _order, context) => {
      queryClient.setQueryData(queryKey, context?.previousOrders)
      toast.error("Error al actualizar el pedido");
    },
    onSettled: (_data, error) => {
      if (error) {
        console.log(error);
      }
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.summary });
    }
  })

  const form = useForm<CreateOrderType>({
    defaultValues: {
      clientId: order?.clientId || undefined,
      toDeliverAt: order?.toDeliverAt || new Date(),
      status: order?.status || "PENDING",
      products: order?.products || []
    }
  })

  const { handleSubmit, watch, setValue, reset, formState: { isSubmitting, isDirty } } = form;

  const onSubmit = async (data: CreateOrderType) => {
    setOpen(null);
    const dataToSubmit = {
      ...data,
      ...(data.toDeliverAt &&
      {
        toDeliverAt: new Date(
          new Date(data.toDeliverAt).toLocaleString("en-US", { timeZone: "UTC" })
        )
      })
    };

    if (order) {
      updateOrderMutation.mutate({ ...order, ...dataToSubmit });
    } else {
      addOrderMutation.mutate(data);
    }
    reset();
  }

  const handleAddProduct = (productId: number) => {
    if (productId === 0) return;
    const products = watch('products');
    setValue('products', [...products, { productId, quantity: 1 }], { shouldDirty: true });
  }

  const handleRemoveProduct = (productId: number) => {
    const products = watch('products');
    setValue('products', products.filter(p => p.productId !== productId), { shouldDirty: true });
  }

  const handleDecreaseQuantity = (productId: number) => {
    const products = watch('products');
    const product = products.find(p => p.productId === productId);
    if (product?.quantity === 1) {
      handleRemoveProduct(productId);
      return;
    }
    setValue('products', products.map(p => p.productId === productId ? { ...p, quantity: p.quantity - 1 } : p), { shouldDirty: true });
  }

  const handleIncreaseQuantity = (productId: number) => {
    const products = watch('products');
    const product = productsData?.find(p => p.id === productId);
    const currentQuantity = productsData?.find(p => p.id === productId)?.stock ?? 0;
    if ((product?.stock === 0) || (product?.stock && product?.stock < currentQuantity)) {
      toast.error("No hay suficiente stock del producto");
      return;
    }
    setValue('products', products.map(p => p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p), { shouldDirty: true });
  }
  const productsToShow = productsData && productsData.filter(
    (p) => !watch('products').map(e => e.productId).includes(p.id)
  );

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={!!open} onOpenChange={(e) => setOpen(!!e ? (order?.id || 0) : null)}>
      <DialogTrigger
        hidden={!!order}
        className="bg-foreground text-background p-2 rounded-md text-sm font-medium dark:bg-neutral-700 dark:text-white"
      >
        Agregar Pedido
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-neutral-900">
        <Form {...form}>
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
              {
                order && order.createdAt && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="createdAt" className="text-right col-span-1">
                      Fecha de creación
                    </Label>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal opacity-50 cursor-not-allowed col-span-3"
                      )}
                      disabled
                      type="button"
                    >
                      {format(new Date(order.createdAt), "PPP", { locale: es })}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </div>
                )
              }
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="clientId" className="text-right col-span-1">
                    Cliente
                  </Label>
                  <Select
                    name="clientId"
                    value={watch('clientId')}
                    onValueChange={(e: CreateOrderType['clientId']) => setValue('clientId', e, { shouldDirty: true })}
                    disabled={!clients.data || clients.data.length === 0}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={
                        (!clients.data || clients.data.length === 0) ? "No hay clientes" : "Selecciona un cliente"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.data && clients.data.length > 0 && clients.data.map((client) => (
                        <SelectItem value={client.id} key={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {watch('clientId') && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="col-span-1" />
                    <div className="col-span-3 space-y-2 p-1 rounded-md bg-card">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-xs">Dirección:</span>
                        <span className="text-gray-600 text-xs">{clients.data?.find(e => e.id === watch('clientId'))?.address}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-xs">Teléfono:</span>
                        <span className="text-gray-600 text-xs">{clients.data?.find(e => e.id === watch('clientId'))?.phone}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right col-span-1">
                  Estado
                </Label>
                <Select
                  name="status"
                  value={watch('status')}
                  onValueChange={
                    (e) => setValue('status', e as CreateOrderType['status'], { shouldDirty: true })
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="toDeliverAt" className="text-right col-span-1">
                  Fecha de entrega
                </Label>
                <div className="col-span-3">
                  <RHFDatePicker name="toDeliverAt" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right col-span-1">
                  Productos
                </Label>
                <Select
                  value="0"
                  onValueChange={
                    (e: string) => handleAddProduct(Number(e))
                  }
                  disabled={!productsToShow || productsToShow.length === 0}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={
                      (!productsToShow || productsToShow.length === 0) ? "No hay productos" : "Selecciona un producto"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Seleccione un producto</SelectItem>
                    {
                      productsToShow && productsToShow.length > 0 && productsToShow.map((product) => (
                        <SelectItem value={product.id.toString()} key={product.id}>
                          {product.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              {
                watch('products').length > 0 && (
                  <div className="flex flex-col gap-2 max-h-[350px] overflow-y-scroll">
                    {
                      watch('products').map((p) => (
                        <div key={p.productId} className="grid grid-cols-4 gap-2 p-2 rounded-md bg-neutral-100 items-center">
                          <span className="text-xs font-medium col-span-2">
                            {productsData?.find(e => e.id === p.productId)?.name}
                          </span>
                          <div className="flex items-center gap-2 col-span-1">
                            <Button variant={"ghost"} size={"icon"} onClick={() => handleDecreaseQuantity(p.productId)} type="button">
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-xs font-medium">{p.quantity}</span>
                            <Button variant={"ghost"} size={"icon"} onClick={() => handleIncreaseQuantity(p.productId)} type="button">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            onClick={() => handleRemoveProduct(p.productId)}
                            type="button"
                            className="col-span-1"
                          >
                            Eliminar
                          </Button>
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right col-span-1">Precio Final</Label>
              <span className="col-span-3 text-right font-medium text-green-500">{calculatePrice(
                (watch('products') as unknown as CompleteOrderProduct[]),
                productsData
              )}</span>
            </div>
            <div className="grid grid-cols-1 mt-10">
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="dark:bg-neutral-700 dark:text-white"
              >
                {order ? "Actualizar Pedido" : "Agregar Pedido"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}