"use client";
import * as React from "react"
import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query";
import ProductsTableRowSkeleton from "./products-table-row-skeleton";
import ProductsTableRow from "./products-table-row";
import AddUpdateProduct from "./add-update-product";
import { Product } from "@/types";
import { getProducts } from "@/services/products";
import { QUERY_KEYS } from "@/lib/tanstack";
import ProductsDeleteConfirmation from "./products-delete-confirmation";


export default function ProductsTable() {
  const [openDetails, setOpenDetails] = React.useState<number | null>(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState<number | null>(null);
  const products = useQuery<Product[]>({
    queryKey: QUERY_KEYS.products.root,
    queryFn: getProducts,
    staleTime: 999 * 60
  })

  const handleOpenDetails = (id: number) => {
    setOpenDetails(id);
  }

  const handleOpenDeleteConfirmation = (id: number) => {
    setOpenDeleteConfirmation(id);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Productos</CardTitle>
        <div className="flex items-center justify-end gap-3">
          {products.isFetching && <Loader2 className="animate-spin" />}
          <AddUpdateProduct queryKey={QUERY_KEYS.products.root} open={openDetails === 0} setOpen={setOpenDetails} />
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Precio</TableHead>
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
                      handleOpenDetails={handleOpenDetails}
                      handleOpenDeleteConfirmation={handleOpenDeleteConfirmation}
                    />
                    {
                      openDetails === product.id && (
                        <AddUpdateProduct 
                          queryKey={QUERY_KEYS.products.root} 
                          open={openDetails === product.id} 
                          setOpen={setOpenDetails} 
                          product={product}
                        />
                      )
                    }
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