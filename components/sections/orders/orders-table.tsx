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
import { GetOrdersParams, Order } from "@/types/order";
import AddUpdateOrder from "./add-update-order";
import { getOrders } from "@/services/orders";
import { Client } from "@/types/client";
import { getClients } from "@/services/clients";
import { OrderStatus } from "@prisma/client"
import TableRowSkeleton from "./order-table-row-skeleton";
import OrderTableRow from "./order-table-row";
import { CompleteOrderProduct } from "@/prisma/zod";


export default function OrdersTable() {
  const [openDetails, setOpenDetails] = React.useState<number | null>(null);

  const [params, setParams] = React.useState<GetOrdersParams>({
    page: 0,
    per_page: 10,
    status: "ALL"
  });

  const ordersQuery = useQuery<(Order & {products:CompleteOrderProduct[]})[]>({
    queryKey: ["orders", params.page, params.status],
    queryFn: () => getOrders(params),
  })

  const clients = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: getClients
  })

  const client = (cuid: string) => clients.data?.find(e => e.id === cuid)?.name || " - ";

  const handlePrevPage = () => {
    const newPage = params.page - 1 <= 0 ? 0 : params.page - 1;
    setParams(prev => ({
      ...prev,
      page: newPage
    }))
  }
  const handleNextPage = () => {
    const newPage = params.page + 1;
    setParams(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const handleOpenDetails = (id: number) => {
    setOpenDetails(id);
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Pedidos</CardTitle>
        <div className="flex items-center justify-end gap-3">
          {ordersQuery.isFetching && <Loader2 className="animate-spin" />}
          <AddUpdateOrder queryKey={["orders", params.page, params.status]} open={openDetails === 0} setOpen={setOpenDetails} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pedido..."
              className="pl-8"
            />
          </div>
          <Select value={params.status} onValueChange={(v) => setParams(prev => ({ ...prev, status: v as (OrderStatus | "ALL") }))}>
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
                Array.from({ length: params.per_page }, (_, i) => i)
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
                      client={client}
                    />
                    <AddUpdateOrder order={order} queryKey={["orders", params.page, params.status]} open={openDetails === order.id} setOpen={setOpenDetails} />
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-base font-bold">Pagina: {params.page + 1}</p>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={params.page === 0}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextPage}>
              Siguiente
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}