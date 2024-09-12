import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

export default function TableRowSkeleton() {
  return (
    <TableRow className="hover:bg-muted/50 transition-colors cursor-pointer">
      <TableCell>
        <Skeleton className="w-full h-10" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-10" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-10" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-10" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-10" />
      </TableCell>
      <TableCell className="text-right">

        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>

      </TableCell>
    </TableRow>
  )
}