"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OrderWithProducts } from "@/types";
import { useMemo } from "react";
import { toast } from "sonner";

interface DeliveryMarkAsDeliveredProps {
  orderIds: number[];
  children: React.ReactNode;
  onMarkAsDelivered?: () => void;
  disabled?: boolean;
  orders?: OrderWithProducts[];
}

const messageTemplate = (order: OrderWithProducts) => {
  const productsList = order.products.map((product) =>
    `🔸${product.quantity} x ${product.product.name}`
  ).join('\n');

  return `🙋‍♂️${order.client.name || ''}
📞${order.client.phone || ''}
📍${order.client.city || ''} ${order.client.address || ''}✅
${productsList}
$${order.total.toLocaleString()} (total)\n`;
}

export default function GenerateMessageList({ orderIds, children, onMarkAsDelivered, disabled, orders }: DeliveryMarkAsDeliveredProps) {
  const ordersSelected = useMemo(() => orders?.filter((order) => orderIds.includes(order.id)), [orderIds, orders]);
  const message = useMemo(() => ordersSelected?.map((order) => messageTemplate(order)).join('\n'), [ordersSelected]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message || '');
    toast.success('Mensaje copiado');
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Generar mensaje de WhatsApp</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <Textarea
            value={message}
            className="h-96"
          />
        </AlertDialogDescription>
        <AlertDialogFooter className="flex flex-col gap-2">
          <Button variant="outline" className="w-full" onClick={handleCopy}>Copiar</Button>
          <AlertDialogCancel className="w-full">Cerrar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
