"use client";
import * as React from "react"
import { Loader2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProductsTableRowSkeleton from "./products-table-row-skeleton";
import ProductsTableRow from "./products-table-row";
import { QUERY_KEYS } from "@/lib/tanstack";
import ProductsDeleteConfirmation from "./products-delete-confirmation";
import Link from "next/link";
import { APP_PATH } from "@/config/path";
import { Button } from "@/components/ui/button";
import { useProductsQuery } from "@/lib/tanstack/useProducts";

export default function ProductsTable() {
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState<number | null>(null);
  const products = useProductsQuery();

  const handleOpenDeleteConfirmation = (id: number) => {
    setOpenDeleteConfirmation(id);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto dark:bg-neutral-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold text-black dark:text-white">Productos</CardTitle>
        <div className="flex items-center justify-end gap-3">
          {
            products.isFetching
            && <Loader2 className="animate-spin text-black dark:text-white" />
          }
          <Link href={APP_PATH.protected.products.add}>
            <Button>
              Agregar Producto
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-72">
            {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar producto..."
              className="pl-8"
            /> */}
          </div>
        </div>
        <div className="rounded-md border border-gray-200 dark:border-gray-700">
          <Table className="dark:bg-neutral-800">
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Precio Base</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!products.data && products.isFetching ? (
                Array.from({ length: 10 }, (_, i) => i)
                  .map(e => (
                    <ProductsTableRowSkeleton key={e} />
                  ))
              ) :
                products.data?.map((product) => (
                  <React.Fragment key={product.id}>
                    <ProductsTableRow
                      key={product.id}
                      product={product}
                      handleOpenDeleteConfirmation={handleOpenDeleteConfirmation}
                    />
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <ProductsDeleteConfirmation
        productId={openDeleteConfirmation}
        setOpen={setOpenDeleteConfirmation}
        queryKey={QUERY_KEYS.products.root}
      />
    </Card>
  )
}