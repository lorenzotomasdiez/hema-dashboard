"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BoxIcon, CheckCircle, Package, User, DollarSign } from 'lucide-react';

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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { QUERY_KEYS } from "@/lib/tanstack";
import { moneyMask } from "@/lib/utils";
import { orderMarkAsDelivered } from "@/services/orders";
import { OrderMarkAsDeliveredProps, OrderWithProducts, PaymentMethodLabel, PaymentStatusLabel } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentMethod } from "@prisma/client";
import { PaymentStatus } from "@prisma/client";

interface DeliveryMarkAsDeliveredProps {
  order: OrderWithProducts;
  children: React.ReactNode;
  onMarkAsDelivered?: () => void;
  disabled?: boolean;
}

export default function DeliveryMarkAsDelivered({
  order,
  children,
  onMarkAsDelivered,
  disabled
}: DeliveryMarkAsDeliveredProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState<OrderMarkAsDeliveredProps>({
    id: order.id,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod
  });

  const handleMarkAsDelivered = async () => {
    const res = await orderMarkAsDelivered([orderToUpdate]);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    queryClient.cancelQueries({ queryKey: QUERY_KEYS.orders.root });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.root });
    if (onMarkAsDelivered) {
      onMarkAsDelivered();
    }
    toast.success("Orden marcada como entregada correctamente!");
  }

  useEffect(() => {
    if (open) {
      setOrderToUpdate({
        id: order.id,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod
      });
    }
  }, [open]);

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]" onClick={handleDialogClick}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">
            Marcar como entregado
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Por favor confirma si quieres marcar esta orden como entregada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-primary" />
            <span className="font-medium">Cliente:</span>
            <span>{order.client.name}</span>
          </div>
          <div>
            <h4 className="mb-2 text-md font-medium flex items-center">
              <BoxIcon className="w-5 h-5 mr-2 text-primary" />
              Productos
            </h4>
            <ScrollArea className="h-[120px] rounded-md border p-2">
              {order.products.map(p => (
                <div key={p.productId} className="flex justify-between items-center py-2">
                  <span className="font-medium">{p.product.name}</span>
                  <Badge variant="secondary">x{p.quantity}</Badge>
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium">Estado de pago</span>
            <Select
              onValueChange={(value) => setOrderToUpdate({ ...orderToUpdate, paymentStatus: value as PaymentStatus })}
              defaultValue={orderToUpdate.paymentStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado de pago" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PaymentStatusLabel).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium">Método de pago</span>
            <Select
              onValueChange={(value) => setOrderToUpdate({ ...orderToUpdate, paymentMethod: value as PaymentMethod })}
              defaultValue={orderToUpdate.paymentMethod}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método de pago" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PaymentMethodLabel).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="font-medium">Total:</span>
            </div>
            <span className="text-lg font-bold">{moneyMask(order.total)}</span>
          </div>
        </div>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel className="border-primary text-primary hover:bg-primary/10">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleMarkAsDelivered}
            className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary-foreground dark:text-primary dark:hover:bg-primary-foreground/90"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Marcar como entregado
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

