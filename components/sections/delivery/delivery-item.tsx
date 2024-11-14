"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import { APP_PATH } from "@/config/path";
import { OrderWithProducts } from "@/types";
import { cn, moneyMask } from "@/lib/utils";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import DeliveryMarkAsDelivered from "./mark-as-delivered";

interface DeliveryItemProps {
  order: OrderWithProducts;
  isSelected?: boolean;
  handleSelect?: (id: number) => void;
}

export default function DeliveryItem({ order, isSelected, handleSelect }: DeliveryItemProps) {

  const handleSelectOrder = (e: React.MouseEvent) => {
    if (order.status === OrderStatus['DELIVERED']) return;
    e.stopPropagation();
    if (handleSelect) {
      handleSelect(order.id);
    }
  }

  return (
    <Card className={cn(
      "cursor-pointer transition-all h-fit hover:shadow-md dark:bg-zinc-700 dark:hover:shadow-none",
      order.status === OrderStatus['DELIVERED'] && "opacity-70"
    )} onClick={handleSelectOrder}>
      <CardContent className="p-4">
        <div className="space-y-3 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="flex items-start gap-3 md:items-center">
            {
              order.status !== OrderStatus['DELIVERED'] && (
                <Checkbox
                  checked={isSelected}
                  onClick={handleSelectOrder}
                  className="h-4 w-4 mt-1 md:mt-0"
                />
              )
            }
            <div>
              <p className="font-medium text-base md:text-lg">
                {order.client.name.length > 30 ? `${order.client.name.slice(0, 30)}...` : order.client.name}
              </p>
              <p className="text-green-500 font-medium md:hidden">
                {moneyMask(order.total)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 md:justify-end">
            <span
              className="hidden md:inline-flex text-sm text-green-500 font-medium border-none"
            >
              ${moneyMask(order.total)}
            </span>

            <div className="flex gap-2 w-full md:w-auto">
              <Link href={APP_PATH.protected.orders.details(order.id)}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 md:flex-none"
                  type="button"
                >
                  Detalles
                </Button>
              </Link>
              <DeliveryMarkAsDelivered orderIds={[order.id]} disabled={order.status === OrderStatus['DELIVERED']}>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1 md:flex-none hover:text-green-600 hover:bg-green-50",
                    order.status === OrderStatus['DELIVERED'] && "text-green-500 bg-green-50 !opacity-100"
                  )}
                >
                  {
                    order.status !== OrderStatus['DELIVERED'] && (
                      <Check className="h-4 w-4" />
                    )
                  }
                  <span>
                    Entregado
                  </span>
                </Button>
              </DeliveryMarkAsDelivered>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}