"use client";

import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, MoreHorizontal } from "lucide-react";
import { OrderStatus } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Order } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { updateOrder } from "@/services/orders";

interface Props {
  order: Order;
  handleOpenDetails: (id: number) => void;
  client: (cuid: string) => string
}

export default function OrderTableRow({ order, handleOpenDetails, client }: Props) {
  return (
    <TableRow className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleOpenDetails(order.id)}>
      <TableCell className="font-bold">{order.createdAt && format(new Date(order.createdAt.toString()), 'dd/MM')}</TableCell>
      <TableCell align="left">{client(order.clientId)}</TableCell>
      <TableCell align="left">
          <span className={cn(
            "relative px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800",
            order.status === "PENDING" && "bg-yellow-100 text-yellow-800",
            order.status === "SHIPPED" && "bg-blue-100 text-blue-800",
          )}>
            {OrderStatus[order.status] === "PENDING" && "Pendiente"}
            {OrderStatus[order.status] === "SHIPPED" && "En camino"}
            {OrderStatus[order.status] === "DELIVERED" && "Entregado"}
          </span>
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