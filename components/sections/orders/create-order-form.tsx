"use client";

import { useForm } from "react-hook-form";
import { Plus, Minus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { AddOrderMutation, useClientsQuery, useProductsQuery } from "@/lib/tanstack";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from '@/components/ui/card'
import { RHFDatePicker } from "@/components/rhf";
import { CreateOrderDTO } from "@/types";
import { useRouter } from "next/navigation";
import { APP_PATH } from "@/config/path";
import { Separator } from "@radix-ui/react-select";

export default function CreateOrderForm() {
  const queryClient = useQueryClient();

  const router = useRouter();

  const addOrderMutation = AddOrderMutation(queryClient);

  const { data: clients } = useClientsQuery();

  const { data: products } = useProductsQuery();


  const form = useForm<CreateOrderDTO>({
    defaultValues: {
      clientId: undefined,
      toDeliverAt: new Date(),
      status: "PENDING",
      products: []
    }
  })

  const { handleSubmit, watch, setValue, formState: { isSubmitting, isDirty } } = form;

  const onSubmit = async (data: CreateOrderDTO) => {
    addOrderMutation.mutate(data);
    router.push(APP_PATH.protected.orders.root);
  }

  const handleAddProduct = (productId: number) => {
    const products = watch('products')
    if (products.find(p => p.productId === productId)) return;
    setValue('products', [...products, { productId, quantity: 1 }])
  }

  const handleRemoveProduct = (productId: number) => {
    const products = watch('products')
    setValue('products', products.filter(p => p.productId !== productId))
  }

  const handleQuantityChange = (productId: number, change: number) => {
    const products = watch('products')
    setValue('products', products.map(p =>
      p.productId === productId ? { ...p, quantity: Math.max(1, p.quantity + change) } : p
    ))
  }

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
              <Card className="bg-muted">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Ciudad:</span>
                    <span className="text-sm">{clients?.find(c => c.id === watch('clientId'))?.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Dirección:</span>
                    <span className="text-sm">{clients?.find(c => c.id === watch('clientId'))?.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Teléfono:</span>
                    <span className="text-sm">{clients?.find(c => c.id === watch('clientId'))?.phone}</span>
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
            <Card>
              <CardContent className="p-4 space-y-4">
                {watch('products').map((p) => (
                  <div key={p.productId} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{products?.find(prod => prod.id === p.productId)?.name}</span>
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
        <div>
          <Button type="submit" className="w-full" disabled={isSubmitting || !isDirty}>
            Crear Pedido
          </Button>
        </div>
      </form>
    </Form>
  )
}