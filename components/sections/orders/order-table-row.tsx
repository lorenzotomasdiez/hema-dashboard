"use client";

import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { OrderStatus, Product } from "@prisma/client"

import { Order } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { calculatePrice, cn } from "@/lib/utils";
import { CompleteOrderProduct } from "@/prisma/zod";

interface Props {
  order: Order & { products: CompleteOrderProduct[] };
  productsData: Product[] | undefined;
  handleOpenDetails: (id: number) => void;
  client: (cuid: string) => string
  handleDeleteOrder: (id: number) => void;
}

export default function OrderTableRow({ order, handleOpenDetails, client, handleDeleteOrder, productsData }: Props) {
  const handleClickDelete = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    handleDeleteOrder(order.id);
  }
  return (
    <TableRow className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleOpenDetails(order.id)}>
      <TableCell className="font-bold">{order.deliveredAt && format(new Date(order.deliveredAt.toString()), 'dd/MM')}</TableCell>
      <TableCell align="left">{client(order.clientId)}</TableCell>
      <TableCell align="center">
          <span className={cn(
            "relative px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 whitespace-nowrap",
            order.status === "PENDING" && "bg-yellow-100 text-yellow-800",
            order.status === "SHIPPED" && "bg-blue-100 text-blue-800",
          )}>
            {OrderStatus[order.status] === "PENDING" && "Pendiente"}
            {OrderStatus[order.status] === "SHIPPED" && "En camino"}
            {OrderStatus[order.status] === "DELIVERED" && "Entregado"}
          </span>
      </TableCell>
      <TableCell className="text-right">
        {calculatePrice(order.products, productsData)}
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
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleClickDelete}>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}