"use client";

import { MoreHorizontal } from "lucide-react";

import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";

interface Props {
  client: Client & { ordersTotal: number };
  handleOpenDetails: (id: string) => void;
  handleOpenDeleteConfirmation: (id: string) => void;
}
export default function ClientsTableRow({ client, handleOpenDetails, handleOpenDeleteConfirmation }: Props) {
  const handleClickOpenDelete = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    handleOpenDeleteConfirmation(client.id);
  }
  return (
    <TableRow className="hover:bg-muted/50 transition-colors cursor-pointer dark:hover:bg-neutral-900" onClick={() => handleOpenDetails(client.id)}>
      <TableCell className="font-bold">{client.name}</TableCell>
      <TableCell align="left">{client.phone}</TableCell>
      <TableCell align="left">{client.address}</TableCell>
      <TableCell align="center">{client.ordersTotal}</TableCell>
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
            <DropdownMenuItem onClick={() => handleOpenDetails(client.id)}>Ver Detalles</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleClickOpenDelete}>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}