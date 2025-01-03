import { CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CompanyExpenseSkeleton(){
  return (
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left dark:text-gray-200">Nombre del Costo</TableHead>
            <TableHead className="text-right dark:text-gray-200">Monto</TableHead>
            <TableHead className="text-right dark:text-gray-200">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3].map((_, index) => (
            <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
              <TableCell className="font-medium">
                <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
              </TableCell>
              <TableCell className="text-right">
                <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <div className="h-8 w-8 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  )
}