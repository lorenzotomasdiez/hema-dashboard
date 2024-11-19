"use client";

import { useForm } from "react-hook-form";
import { Plus, Minus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useClientsQuery, useProductsQuery, UpdateOrderMutation } from "@/lib/tanstack";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from '@/components/ui/card'
import { RHFDatePicker } from "@/components/rhf";
import { UpdateOrderDTO } from "@/types";
import { useRouter } from "next/navigation";
import { APP_PATH } from "@/config/path";
import { Separator } from "@/components/ui/separator";
import { OrderComplete } from "@/types";
import { useCallback } from "react";

export default function UpdateOrderForm({ order }: { order: OrderComplete }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const updateOrderMutation = UpdateOrderMutation(queryClient);

  const { data: clients } = useClientsQuery();

  const { data: products } = useProductsQuery();


  const form = useForm<UpdateOrderDTO>({
    defaultValues: {
      id: order.id,
      clientId: order.clientId,
      toDeliverAt: order.toDeliverAt ? new Date(order.toDeliverAt) : undefined,
      status: order.status,
      products: order.products?.map(p => ({
        productId: p.productId,
        quantity: p.quantity
      }))
    }
  })

  const { handleSubmit, watch, setValue, formState: { isSubmitting, isDirty } } = form;

  const onSubmit = async (data: UpdateOrderDTO) => {
    updateOrderMutation.mutate(data);
    router.push(APP_PATH.protected.orders.root);
  }

  const handleAddProduct = useCallback((productId: number) => {
    const products = watch('products')
    if (products.find(p => p.productId === productId)) return;
    setValue('products', [...products, { productId, quantity: 1 }], { shouldDirty: true })
  }, [watch, setValue]);

  const handleRemoveProduct = (productId: number) => {
    const products = watch('products')
    setValue('products', products.filter(p => p.productId !== productId), { shouldDirty: true })
  }

  const handleQuantityChange = (productId: number, change: number) => {
    const products = watch('products')
    setValue('products', products.map(p =>
      p.productId === productId ? { ...p, quantity: Math.max(1, p.quantity + change) } : p
    ), { shouldDirty: true })
  }

  const detectIfProductHasSpecialPrice = order.products.some(p => p.product.price !== p.price);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <div>
            {watch('clientId') && (
              <Card className="bg-muted dark:bg-muted/50 border border-white/10 dark:border-white/50">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-foreground/80 dark:text-foreground/70">Ciudad:</span>
                    <span className="text-sm dark:text-foreground/80">{clients?.find(c => c.id === watch('clientId'))?.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-foreground/80 dark:text-foreground/70">Dirección:</span>
                    <span className="text-sm dark:text-foreground/80">{clients?.find(c => c.id === watch('clientId'))?.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-foreground/80 dark:text-foreground/70">Teléfono:</span>
                    <span className="text-sm dark:text-foreground/80">{clients?.find(c => c.id === watch('clientId'))?.phone}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendiente</SelectItem>
                    <SelectItem value="SHIPPED">En camino</SelectItem>
                    <SelectItem value="DELIVERED">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toDeliverAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de entrega</FormLabel>
                <FormControl>
                  <RHFDatePicker {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Productos</FormLabel>
            <Select onValueChange={(value) => handleAddProduct(Number(value))}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Agregar un producto" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {products?.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {watch('products').length > 0 && (
            <Card className="dark:border-border/50">
              <CardContent className="p-4 space-y-4">
                {watch('products').map((p) => (
                  <div key={p.productId} className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-foreground/90">
                      {products?.find(prod => prod.id === p.productId)?.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(p.productId, -1)}
                        type="button"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">{p.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(p.productId, 1)}
                        type="button"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveProduct(p.productId)}
                        type="button"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
        <Separator className="my-4" />

        {detectIfProductHasSpecialPrice && (
          <>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-lg font-semibold text-black dark:text-white mb-3">
                Productos con precios especiales aplicados
              </p>
              <div className="space-y-3">
                {order.products
                  .filter(p => p.product.price !== p.price)
                  .map(p => (
                    <div 
                      key={p.productId} 
                      className="flex flex-col space-y-1 p-3 rounded-md bg-background border border-border/50"
                    >
                      <p className="font-medium text-foreground">{p.product.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <p>Precio original: ${p.product.price}</p>
                        <span>→</span>
                        <p className="font-medium text-primary">Precio especial: ${p.price}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
            <Separator className="my-4" />
          </>
        )}
        <div>
          <Button
            type="submit"
            className="w-full dark:hover:bg-primary/90"
            disabled={isSubmitting || !isDirty}
          >
            Actualizar Pedido
          </Button>
        </div>
      </form>
    </Form>
  )
}