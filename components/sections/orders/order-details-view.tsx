'use client';

import { Order, OrderStatus } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "lucide-react";
import { useClientsQuery } from "@/lib/tanstack";
import { moneyMask } from "@/lib/utils";
import { OrderComplete } from "@/types";

interface OrderDetailsViewProps {
  order: OrderComplete;
}

const statusColors = {
  [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.SHIPPED]: "bg-green-100 text-green-800",
  [OrderStatus.DELIVERED]: "bg-red-100 text-red-800",
};

const statusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Pendiente",
  [OrderStatus.SHIPPED]: "Completado",
  [OrderStatus.DELIVERED]: "Cancelado",
};

export const OrderDetailsView = ({ order }: OrderDetailsViewProps) => {
  const { data: clients } = useClientsQuery();
  const client = clients?.find(c => c.id === order.clientId);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Creado el {format(new Date(order.createdAt), "PPP", { locale: es })}
          </p>
        </div>
        <Badge className={statusColors[order.status]}>
          {statusLabels[order.status]}
        </Badge>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Detalles del Pedido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Cliente</p>
            <p className="font-medium">
            {clients?.find(c => c.id === order.clientId)?.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ciudad</p>
            <p className="font-medium">
              {clients?.find(c => c.id === order.clientId)?.city}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Teléfono</p>
            <p className="font-medium">
              {clients?.find(c => c.id === order.clientId)?.phone}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dirección</p>
            <p className="font-medium">
              {clients?.find(c => c.id === order.clientId)?.address}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-medium">{moneyMask(order.total)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}; 