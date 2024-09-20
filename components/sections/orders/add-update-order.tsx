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
import { CreateOrderType, GetOrdersParams, Order } from "@/types/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { getClients } from "@/services/clients";
import { createOrder, updateOrder } from "@/services/orders";
import { toast } from "sonner";
import { CompleteOrderProduct } from "@/prisma/zod";
import { getProducts } from "@/services/products";
import { Minus, Plus } from "lucide-react";
import { Product } from "@/types";

interface AddUpdateOrderProps {
  order?: Order & { products: CompleteOrderProduct[] };
  queryKey: readonly ["orders", { readonly state: GetOrdersParams }];
  open: boolean;
  setOpen: (open: number | null) => void;
}

export default function AddUpdateOrder({ order, queryKey, open, setOpen }: AddUpdateOrderProps) {
  const queryClient = useQueryClient();

  const clients = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: getClients
  })

  const productsQuery = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts
  })

  const addOrderMutation = useMutation({
    mutationKey: ["addOrder"],
    mutationFn: (orderData: CreateOrderType) => createOrder({
      ...orderData,
    }),
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
    mutationKey: ["updateOrder"],
    mutationFn: (orderData: Order) => updateOrder(orderData.id, {
      ...orderData,
    }),
    onMutate: async (orderData: Order) => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previousOrders = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Order[]) => old.map(o => o.id === orderData.id ? orderData : o));
      return { previousOrders }
    },
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
    handleSubmit,
    watch,
    formState: { isSubmitting },
    setValue,
    reset,
  } = useForm<CreateOrderType>({
    defaultValues: {
      clientId: order?.clientId || undefined,
      deliveredAt: order?.deliveredAt || undefined,
      status: order?.status || "PENDING",
      products: order?.products || []
    }
  })

  const onSubmit = async (data: CreateOrderType) => {
    setOpen(null);
    if (order) {
      updateOrderMutation.mutateAsync({ ...order, ...data }).then(() => {
      });
    } else {
      addOrderMutation.mutateAsync(data).then((res) => {
        if (!res.success) {
          console.error(res);
          return;
        }
        toast.success("Pedido creado correctamente!");
      });
    }
    reset();
  }

  const handleAddProduct = (productId: number) => {
    if(productId === 0) return;
    const products = watch('products');
    setValue('products', [...products, { productId, quantity: 1 }]);
  }

  const handleRemoveProduct = (productId: number) => {
    const products = watch('products');
    setValue('products', products.filter(p => p.productId !== productId));
  }

  const handleDecreaseQuantity = (productId: number) => {
    const products = watch('products');
    const product = products.find(p => p.productId === productId);
    if(product?.quantity === 1) {
      handleRemoveProduct(productId);
      return;
    }
    setValue('products', products.map(p => p.productId === productId ? { ...p, quantity: p.quantity - 1 } : p));
  }

  const handleIncreaseQuantity = (productId: number) => {
    const products = watch('products');
    const product = productsQuery?.data?.find(p => p.id === productId);
    const currentQuantity = products.find(p => p.productId === productId)?.quantity ?? 0;
    if((product?.stock === 0) || (product?.stock && product?.stock < currentQuantity)) {
      toast.error("No hay suficiente stock del producto");
      return;
    }
    setValue('products', products.map(p => p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p));
  }
  const productsToShow = productsQuery.data && productsQuery.data.filter(
    (p) => !watch('products').map(e => e.productId).includes(p.id)
  );


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
                Productos
              </Label>
              <Select
                value="0"
                onValueChange={
                  (e: string) =>  handleAddProduct(Number(e))
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
            <div className="flex flex-col gap-3">
              {
                watch('products').map((p) => (
                  <div key={p.productId} className="flex items-center gap-2 justify-between border p-2 rounded-md">
                    <span>{productsQuery.data?.find(e => e.id === p.productId)?.name}</span>
                    <div className="flex items-center gap-2">
                      <Button variant={"ghost"} size={"icon"} onClick={() => handleDecreaseQuantity(p.productId)} type="button">
                        <Minus />
                      </Button>
                      <span>{p.quantity}</span>
                      <Button variant={"ghost"} size={"icon"} onClick={() => handleIncreaseQuantity(p.productId)} type="button">
                        <Plus />
                      </Button>
                    </div>
                    <Button onClick={() => handleRemoveProduct(p.productId)} type="button">Eliminar</Button>
                  </div>
                ))
              }
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