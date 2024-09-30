"use client";
import * as React from "react"
import { CalendarIcon, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { OrderStatus, Product } from "@prisma/client"
import TableRowSkeleton from "./order-table-row-skeleton";
import OrderTableRow from "./order-table-row";
import { useOrders } from "@/lib/tanstack";
import OrderDeleteConfirmation from "./order-delete-confirmation";
import { getProducts } from "@/services/products";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { cn } from "@/lib/utils";

export default function OrdersTable() {
  const [openDetails, setOpenDetails] = React.useState<number | null>(null);
  const [openDelete, setOpenDelete] = React.useState<number | null>(null);
  const [keywordInput, setKeywordInput] = React.useState<string>("");

  const {
    ordersQuery,
    handlePrevPage,
    handleNextPage,
    handleStatus,
    handleForToday,
    handleKeyword,
    page,
    status,
    keyword,
    queryKey,
    per_page,
    forToday,
    prefetchNextPage,
    prefetchPrevPage,
  } = useOrders({
    initialParams: {
      page: 0,
      per_page: 10,
      status: "ALL",
      forToday: false,
      keyword: ""
    }
  })

  const clients = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 999 * 60
  })

  const productsQuery = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 999 * 60
  })

  const client = (cuid: string) => {
    const name = clients.data?.find(e => e.id === cuid)?.name;
    return name && name.length > 25 ? `${name.slice(0, 25)}...` : name || " - ";
  };

  const handleOpenDetails = (id: number) => {
    setOpenDetails(id);
  }

  const handleDeleteOrder = (id: number) => {
    setOpenDelete(id);
  }

  React.useEffect(() => {
    const debouncedHandleKeyword = debounce(() => handleKeyword(keywordInput), 500);
    debouncedHandleKeyword();
    return () => {
      debouncedHandleKeyword.cancel();
    }
  }, [keywordInput])

  return (
    <Card className="w-full dark:bg-neutral-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Pedidos</CardTitle>
        <div className="flex items-center justify-end gap-3">
          {ordersQuery.isFetching && <Loader2 className="animate-spin" />}
          <AddUpdateOrder
            queryKey={queryKey}
            open={openDetails === 0}
            setOpen={setOpenDetails}
            productsData={productsQuery.data}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 items-start justify-center mb-6 md:flex-row md:justify-between md:items-center">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ingrese un nombre de cliente..."
              className="pl-8"
              onChange={(e) => setKeywordInput(e.target.value)}
              value={keywordInput}
            />
          </div>
          <div className="flex items-center justify-between gap-3 w-full md:w-auto md:justify-end">
            <Button
              variant={forToday ? "default" : "outline"}
              className={cn(
                "h-9 px-3 dark:bg-neutral-700 dark:text-white",
                forToday ? 'bg-primary text-primary-foreground dark:bg-neutral-100 dark:text-black' : 'bg-background'
              )}
              onClick={() => handleForToday(!forToday)}
              aria-pressed={forToday}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Hoy
            </Button>
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
        </div>
        <div className="rounded-md border min-h-[532px] dark:bg-neutral-800">
          <Table className="dark:bg-neutral-800">
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Entrega</TableHead>
                <TableHead className="w-40">Cliente</TableHead>
                <TableHead className="text-center w-20">Estado</TableHead>
                <TableHead className="text-right w-20">Precio Final</TableHead>
                <TableHead className="text-right w-10">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!ordersQuery.data && ordersQuery.isFetching ? (
                Array.from({ length: per_page }, (_, i) => i)
                  .map(e => (
                    <TableRowSkeleton key={e} />
                  ))
              ) :
                ordersQuery.data?.orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <OrderTableRow
                      key={order.id}
                      order={order}
                      handleOpenDetails={handleOpenDetails}
                      handleDeleteOrder={handleDeleteOrder}
                      client={client}
                      productsData={productsQuery.data}
                    />
                    <AddUpdateOrder
                      order={order}
                      queryKey={queryKey}
                      open={openDetails === order.id}
                      setOpen={setOpenDetails}
                      productsData={productsQuery.data}
                    />
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <p className="text-base">
              Pagina: <span className="font-bold">{page + 1}</span>
            </p>
            <p className="text-base">
              Pedidos totales: <span className="font-bold">{ordersQuery.data?.ordersCount}</span>
            </p>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={page === 0}
              onMouseEnter={prefetchPrevPage}
              className="bg-foreground text-background dark:bg-neutral-700 dark:text-white"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={(ordersQuery.data?.orders.length || 0) < per_page}
              onMouseEnter={prefetchNextPage}
              className="bg-foreground text-background dark:bg-neutral-700 dark:text-white"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </CardContent>
      <OrderDeleteConfirmation
        orderId={openDelete}
        setOpen={setOpenDelete}
        queryKey={queryKey}
      />
    </Card>
  )
}