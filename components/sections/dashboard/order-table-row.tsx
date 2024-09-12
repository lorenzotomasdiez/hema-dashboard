"use client";

import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, MoreHorizontal } from "lucide-react";
import { OrderStatus } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Order, OrderTypes } from "@/app/api/orders/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { updateOrder } from "@/services/orders";

interface Props {
  order: Order;
  handleOpenDetails: (id: number) => void;
  client: (cuid: string) => string
  queryKey: (string | number)[]
}

export default function OrderTableRow({ order, handleOpenDetails, client, queryKey }: Props) {
  const queryClient = useQueryClient();
  const toggleStatusMutation = useMutation({
    mutationKey: ["orderStatus"],
    mutationFn: (order: Order) => updateOrder(order.id, order),
    onMutate: async (updatedOrder: Order) => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previousOrders = queryClient.getQueryData<Order[]>(queryKey || ['orders']);

      queryClient.setQueryData(queryKey, (old: Order[]) => old.map(o => o.id === updatedOrder.id ? updatedOrder : o));

      return { previousOrders };
    },
    onSuccess: () => {
      toast.success("Estado actualizado correctamente");
    },
    onError: (err, _order, context) => {
      console.error(err);
      queryClient.setQueryData(queryKey || ['orders'], context?.previousOrders);
      toast.error("Error al actualizar el estado");
    },
  });

  const toggleStatus = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const newStatus: Order["status"] = order.status === "PENDING" ? "SHIPPED" : order.status === "SHIPPED" ? "DELIVERED" : "PENDING";
    toggleStatusMutation.mutate({
      ...order,
      status: newStatus
    });
  }

  return (
    <TableRow className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleOpenDetails(order.id)}>
      <TableCell className="font-bold">{order.createdAt && format(new Date(order.createdAt.toString()), 'dd/MM')}</TableCell>
      <TableCell align="center">{OrderTypes[order.type]}</TableCell>
      <TableCell align="center">{order.quantity}</TableCell>
      <TableCell align="left">{client(order.clientId)}</TableCell>
      <TableCell align="left">
        <button onClick={toggleStatus} disabled={toggleStatusMutation.isPending}>
          <span className={cn(
            "relative px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800",
            order.status === "PENDING" && "bg-yellow-100 text-yellow-800",
            order.status === "SHIPPED" && "bg-blue-100 text-blue-800",
          )}>
            {OrderStatus[order.status]}
            {toggleStatusMutation.isPending && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black/50 flex items-center justify-center rounded-full">
                <Loader2 className="w-4 h-4 animate-spin" color="white" />
              </div>
            )}
          </span>
        </button>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleOpenDetails(order.id)}>Ver Detalles</DropdownMenuItem>
            <DropdownMenuItem>Actualizar Estado</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}