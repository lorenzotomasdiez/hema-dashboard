"use client";
import * as React from "react"
import { Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query";
import AddUpdateOrder from "./add-update-order";
import { Client } from "@/types/client";
import { getClients } from "@/services/clients";
import { OrderStatus } from "@prisma/client"
import TableRowSkeleton from "./order-table-row-skeleton";
import OrderTableRow from "./order-table-row";
import { useOrders } from "@/lib/tanstack";
import OrderDeleteConfirmation from "./order-delete-confirmation";


export default function OrdersTable() {
  const [openDetails, setOpenDetails] = React.useState<number | null>(null);
  const [openDelete, setOpenDelete] = React.useState<number | null>(null);

  const {
    ordersQuery,
    handlePrevPage,
    handleNextPage,
    handleStatus,
    page,
    status,
    keyword,
    queryKey,
    per_page,
    prefetchNextPage,
    prefetchPrevPage
  } = useOrders({initialParams: {
    page: 0,
    per_page: 10,
    status: "ALL"
  }})
  
  const clients = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 999 * 60
  })

  const client = (cuid: string) => clients.data?.find(e => e.id === cuid)?.name || " - ";

  const handleOpenDetails = (id: number) => {
    setOpenDetails(id);
  }

  const handleDeleteOrder = (id: number) => {
    setOpenDelete(id);
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Pedidos</CardTitle>
        <div className="flex items-center justify-end gap-3">
          {ordersQuery.isFetching && <Loader2 className="animate-spin" />}
          <AddUpdateOrder queryKey={queryKey} open={openDetails === 0} setOpen={setOpenDetails} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-72">
            {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pedido..."
              className="pl-8"
            /> */}
          </div>
          <Select value={status} onValueChange={(v) => handleStatus(v as (OrderStatus | "ALL"))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value={OrderStatus['PENDING']}>Pendiente</SelectItem>
              <SelectItem value={OrderStatus['SHIPPED']}>En camino</SelectItem>
              <SelectItem value={OrderStatus['DELIVERED']}>Entregado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creada</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!ordersQuery.data && ordersQuery.isFetching ? (
                Array.from({ length: per_page }, (_, i) => i)
                  .map(e => (
                    <TableRowSkeleton key={e} />
                  ))
              ) :
                ordersQuery.data?.map((order) => (
                  <React.Fragment key={order.id}>
                    <OrderTableRow
                      key={order.id}
                      order={order}
                      handleOpenDetails={handleOpenDetails}
                      handleDeleteOrder={handleDeleteOrder}
                      client={client}
                    />
                    <AddUpdateOrder order={order} queryKey={queryKey} open={openDetails === order.id} setOpen={setOpenDetails} />
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-base font-bold">Pagina: {page + 1}</p>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={page === 0} onMouseEnter={prefetchPrevPage}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={(ordersQuery.data?.length || 0) < per_page} onMouseEnter={prefetchNextPage}>
              Siguiente
            </Button>
          </div>
        </div>
      </CardContent>
      <OrderDeleteConfirmation orderId={openDelete} setOpen={setOpenDelete} queryKey={queryKey} />
    </Card>
  )
}