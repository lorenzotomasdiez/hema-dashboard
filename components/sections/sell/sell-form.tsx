"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createSellSchema, CreateSellType } from "@/dto/order/create-sell.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RHFCombobox } from "@/components/rhf";
import { AddOrderMutation, useClientsQuery, useProductsQuery } from "@/lib/tanstack";
import { useEffect, useState } from "react";
import SellSelectProduct from "./sell-select-product";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentMethodLabel } from "@/types";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X } from "lucide-react";
import { moneyMask } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner";

const PAYMENT_METHOD_MULTIPLIER: Record<PaymentMethod, number> = {
  [PaymentMethod.CASH]: 1,
  [PaymentMethod.CARD]: 1.041,
  [PaymentMethod.TRANSFER]: 1,
  [PaymentMethod.QRPOINT]: 1.017
};

export default function SellForm() {

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [payWith, setPayWith] = useState<number | undefined>(undefined);
  const queryClient = useQueryClient();
  const addOrderMutation = AddOrderMutation(queryClient);
  const { data: clients } = useClientsQuery();
  const { data: products } = useProductsQuery();

  const form = useForm<CreateSellType>({
    resolver: zodResolver(createSellSchema),
    defaultValues: {
      clientId: "",
      products: [],
      isConfirmed: true,
      paymentMethod: PaymentMethod.CASH,
      paymentStatus: PaymentStatus.PAID,
      status: OrderStatus.DELIVERED,
    }
  });

  const { handleSubmit, watch, setValue, formState: { isSubmitting }, reset } = form;

  const selectedClient = watch("clientId");
  const selectedProducts = watch("products");
  const selectedPaymentMethod = watch("paymentMethod");

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

  const onSubmit = async (data: CreateSellType) => {
    const res = await addOrderMutation.mutateAsync(data);
    if (res.id) {
      reset();
    } else {
      toast.error("Error al crear la venta");
    }
    setConfirmDialogOpen(false);
  }

  useEffect(() => {
    if (clients && !selectedClient) {
      const finalConsumerExists = clients.find(client => client.name === "Consumidor Final");
      if (finalConsumerExists) {
        setValue("clientId", finalConsumerExists.id);
      }
    }
  }, [clients, selectedClient]);

  const subTotal = selectedProducts.reduce((acc, product) => {
    const productData = products?.find(prod => prod.id === product.productId);
    if (!productData) return acc;
    return acc + (productData.price * product.quantity);
  }, 0);

  const total = subTotal * PAYMENT_METHOD_MULTIPLIER[selectedPaymentMethod as PaymentMethod];

  return (
    <ScrollArea className="h-full w-full">
      <Form {...form}>
        <form
          className="p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4 px-1">
            <RHFCombobox
              label="Cliente"
              name="clientId"
              placeholder="Buscar cliente"
              options={clients?.map(client => ({ value: client.id, label: client.name })) || []}
              emptyMessage="No existe cliente con ese nombre"
            />
            <SellSelectProduct
              handleAddProduct={handleAddProduct}
              options={products?.map(product => ({ value: product.id.toString(), label: product.name, price: product.price, stock: product.stock })) || []}
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
            <div className="mt-4 pt-4 border-t px-1">
              <div className="flex justify-between items-center font-bold text-md">
                <span>Paga con:</span>
              </div>
              <Input
                type="number"
                value={payWith || ''}
                onChange={(e) => setPayWith(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full no-spinner text-xl h-10"
              />
            </div>
            <div className="space-y-2 px-1">
              <h2 className="font-semibold">Productos Seleccionados:</h2>
              {selectedProducts.map(product => {
                const productData = products?.find(prod => prod.id === product.productId);
                if (!productData) return null;
                return (
                  <div key={product.productId} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{productData?.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(product.productId, -1)}
                          type="button"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => handleInputQuantity(product.productId, Number(e.target.value))}
                          className="w-16 no-spinner"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(product.productId, 1)}
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveProduct(product.productId)}
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t px-1">
            <div className="flex justify-between items-center font-bold text-md">
              <span>Subtotal:</span>
              <span>{moneyMask(subTotal)}</span>
            </div>
            {
              PAYMENT_METHOD_MULTIPLIER[selectedPaymentMethod as PaymentMethod] > 1 && (
                <div className="flex justify-between items-center font-bold text-md">
                  <span>Recargo por {PaymentMethodLabel[selectedPaymentMethod as PaymentMethod]}: {((PAYMENT_METHOD_MULTIPLIER[selectedPaymentMethod as PaymentMethod] - 1) * 100).toFixed(1)}%</span>
                  <span className="text-red-500">{moneyMask(subTotal * (PAYMENT_METHOD_MULTIPLIER[selectedPaymentMethod as PaymentMethod] - 1))}</span>
                </div>
              )
            }
            <div className="flex justify-between items-center font-bold text-xl">
              <span>Total:</span>
              <span className="text-green-500">{moneyMask(total)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t px-1">
            <div className="flex justify-between items-center font-bold text-md text-blue-500">
              <span>Cambio:</span>
              <span>{moneyMask(payWith ? payWith - total : 0)}</span>
            </div>
          </div>
          <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                className="w-full mt-4"
                size="lg"
                disabled={isSubmitting || !selectedClient || !selectedProducts.length}
              >
                Finalizar Venta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Venta</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Estás seguro que deseas finalizar esta venta por un total de {moneyMask(total)}?
                  Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting || !selectedClient || !selectedProducts.length}
                >
                  {isSubmitting ? "Enviando..." : "Confirmar Venta"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    </ScrollArea>
  );
}
