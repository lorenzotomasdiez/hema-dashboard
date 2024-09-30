"use client";

import { MoreHorizontal } from "lucide-react";

import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { moneyMask } from "@/lib/utils";

interface Props {
  product: Product;
  handleOpenDetails: (id: number) => void;
  handleOpenDeleteConfirmation: (id: number) => void;
}
export default function ProductsTableRow({ product, handleOpenDetails, handleOpenDeleteConfirmation }: Props) {

  const handleClickOpenDelete = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    handleOpenDeleteConfirmation(product.id);
  }
  return (
    <TableRow className="transition-colors cursor-pointer dark:bg-neutral-900" onClick={() => handleOpenDetails(product.id)}>
      <TableCell className="font-bold dark:text-neutral-300">{product.name}</TableCell>
      <TableCell align="center" className="dark:text-neutral-300">{product.stock}</TableCell>
      <TableCell align="center" className="dark:text-neutral-300">{moneyMask(product.price)}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-neutral-800">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleOpenDetails(product.id)}>Ver Detalles</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={handleClickOpenDelete}>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}