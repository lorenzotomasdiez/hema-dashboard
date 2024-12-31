"use client";

import { useForm } from "react-hook-form";
import { Plus, Minus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { AddOrderMutation, useClientsQuery, useProductsQuery } from "@/lib/tanstack";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from '@/components/ui/card'
import { RHFDatePicker, RHFCombobox } from "@/components/rhf";
import { CreateOrderDTO, PaymentMethodLabel, PaymentStatusLabel } from "@/types";
import { useRouter } from "next/navigation";
import { APP_PATH } from "@/config/path";
import { Separator } from "@radix-ui/react-select";
import { RHFSwitch } from "@/components/rhf/rhf-switch";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderSchema } from "@/dto/order/create-order.dto";
import { Input } from "@/components/ui/input";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

export default function CreateOrderForm() {
  const queryClient = useQueryClient();

  const router = useRouter();

  const addOrderMutation = AddOrderMutation(queryClient);

  const { data: clients } = useClientsQuery();

  const { data: products } = useProductsQuery();


  const form = useForm<CreateOrderDTO>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      clientId: undefined,
      toDeliverAt: new Date(),
      status: "PENDING",
      products: [],
      isConfirmed: true,
      paymentMethod: PaymentMethod.CASH,
      paymentStatus: PaymentStatus.PENDING,
    }
  })

  const { handleSubmit, watch, setValue, formState: { isSubmitting, isDirty, errors } } = form;

  const onSubmit = async (data: CreateOrderDTO) => {
    addOrderMutation.mutate(data);
    router.push(APP_PATH.protected.orders.root);
  }

  const handleAddProduct = (productId: number) => {
    const products = watch('products')
    if (products.find(p => p.productId === productId)) return;
    setValue('products', [...products, { productId, quantity: 1 }], { shouldValidate: true })
  }

  const handleRemoveProduct = (productId: number) => {
    const products = watch('products')
    setValue('products', products.filter(p => p.productId !== productId), { shouldValidate: true })
  }

  const handleQuantityChange = (productId: number, change: number) => {
    const products = watch('products')
    setValue('products', products.map(p =>
      p.productId === productId ? { ...p, quantity: Math.max(1, p.quantity + change) } : p
    ), { shouldValidate: true })
  }

  const handleInputQuantity = (productId: number, quantity: number) => {
    const products = watch('products')
    setValue('products', products.map(p =>
      p.productId === productId ? { ...p, quantity } : p
    ), { shouldValidate: true })
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RHFCombobox
            label="Cliente"
            name="clientId"
            placeholder="Buscar cliente"
            options={clients?.map(client => ({ value: client.id, label: client.name })) || []}
            emptyMessage="No existe cliente con ese nombre"
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

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de pago</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar método de pago" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(PaymentMethodLabel).map(([key, value]) => (
                      <SelectItem key={key} value={key}>{value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado de pago</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado de pago" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(PaymentStatusLabel).map(([key, value]) => (
                      <SelectItem key={key} value={key}>{value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
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
            {errors.products && <FormMessage>{errors.products.message}</FormMessage>}
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
                      <Input
                        type="number"
                        value={p.quantity}
                        onChange={(e) => handleInputQuantity(p.productId, Number(e.target.value))}
                        className="w-16 no-spinner"
                      />
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
        <div className="flex items-center gap-2">
        </div>
        <div className="grid grid-cols-2 my-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="isConfirmed" className="text-sm font-medium text-gray-700 dark:text-gray-200">Pedido Confirmado</Label>
            <RHFSwitch name="isConfirmed" />
          </div>
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