"use client";
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
import { QUERY_KEYS } from "@/lib/tanstack";
import { orderMarkAsDelivered } from "@/services/orders";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeliveryMarkAsDeliveredProps {
  orderIds: number[];
  children: React.ReactNode;
  onMarkAsDelivered?: () => void;
  disabled?: boolean;
}

export default function DeliveryMarkAsDelivered({ orderIds, children, onMarkAsDelivered, disabled }: DeliveryMarkAsDeliveredProps) {
  const queryClient = useQueryClient();
  
  const handleMarkAsDelivered = async () => {
    const res = await orderMarkAsDelivered(orderIds);
    if(res.error) {
      toast.error(res.error);
      return;
    }
    queryClient.cancelQueries({ queryKey: QUERY_KEYS.orders.root });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.root });
    if (onMarkAsDelivered) {
      onMarkAsDelivered();
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro de querer marcar como entregado?</AlertDialogTitle>
          <AlertDialogDescription>
            Puedes modificar el estado de entrega en la sección de detalles del pedido.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleMarkAsDelivered} className="bg-primary text-primary-foreground dark:bg-primary-foreground dark:text-primary">
            Entregado/s
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
