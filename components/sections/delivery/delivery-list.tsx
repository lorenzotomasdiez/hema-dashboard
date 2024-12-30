"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useOrders } from "@/lib/tanstack";
import { CalendarIcon, Check, Loader2, MessageSquare, Search, Table } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatus } from "@prisma/client";
import DeliveryItem from "./delivery-item";
import Image from "next/image";
import DeliveryMarkAsDelivered from "./mark-as-delivered";
import GenerateMessageList from "./generate-message";

export default function DeliveryList() {
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
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
      per_page: 20,
      status: "ALL",
      forToday: true,
      keyword: "",
      isConfirmed: true
    }
  })

  const handleSelectOrder = (id: number) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders((prev) => prev.filter((orderId) => orderId !== id));
    } else {
      setSelectedOrders((prev) => [...prev, id]);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Pedidos Confirmados</CardTitle>
        <div className="flex items-center justify-end gap-3">
          {ordersQuery.isFetching && <Loader2 className="animate-spin" />}
          {
            selectedOrders.length > 0 && (
              <DeliveryMarkAsDelivered orderIds={selectedOrders}>
                <Button variant="outline" size="sm">
                  <Check className="mr-2 h-4 w-4" />
                  {selectedOrders.length} Pedido/s marcados como entregados
                </Button>
              </DeliveryMarkAsDelivered>
            )
          }
          {
            selectedOrders.length > 0 && (
              <GenerateMessageList orderIds={selectedOrders} orders={ordersQuery.data?.orders}>
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Generar mensaje de WhatsApp
                </Button>
              </GenerateMessageList>
            )
          }
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 items-start justify-center mb-6 md:flex-row md:justify-between md:items-center">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ingrese un nombre de cliente..."
              className="pl-8"
              onChange={(e) => handleKeyword(e.target.value)}
              value={keyword}
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
        <div className="min-h-[532px]">
          <div className="rounded-md grid grid-cols-1 gap-2">
            {
              ordersQuery.isFetching && ordersQuery.data?.orders.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin w-28 h-28 bg-white rounded-full aspect-square flex justify-center items-center dark:bg-white">
                    <Image
                      src="/squared-logo.png"
                      alt="PymePro Logo"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
              )
            }
            {ordersQuery.data?.orders.map((order) => (
              <DeliveryItem key={order.id} order={order} isSelected={selectedOrders.includes(order.id)} handleSelect={handleSelectOrder} />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
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
      </CardFooter>
    </Card>
  )
}