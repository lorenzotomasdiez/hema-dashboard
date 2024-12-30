'use client';

import { OrderStatus } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge, BadgeAlert, BoxIcon, CalendarIcon, CheckCircle, ClockIcon, MapPinIcon, PhoneIcon, Ship, UserIcon } from 'lucide-react';
import { useClientsQuery } from "@/lib/tanstack";
import { moneyMask } from "@/lib/utils";
import { OrderComplete } from "@/types";
import { Separator } from "@/components/ui/separator";

interface OrderDetailsViewProps {
  order: OrderComplete;
}

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.SHIPPED]: "bg-blue-100 text-blue-800",
  [OrderStatus.DELIVERED]: "bg-green-100 text-green-800",
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  [OrderStatus.PENDING]: <ClockIcon className="w-5 h-5 text-yellow-500" />,
  [OrderStatus.SHIPPED]: <Ship className="w-5 h-5 text-blue-500" />,
  [OrderStatus.DELIVERED]: <CheckCircle className="w-5 h-5 text-green-500" />,
};

const statusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Pendiente",
  [OrderStatus.SHIPPED]: "En camino",
  [OrderStatus.DELIVERED]: "Entregado",
};

export const OrderDetailsView = ({ order }: OrderDetailsViewProps) => {
  const { data: clients } = useClientsQuery();
  const client = clients?.find(c => c.id === order.clientId);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Detalles del Pedido</CardTitle>
        <div className="flex items-center space-x-2">
          {statusIcons[order.status]}
          <span className={`text-sm font-medium ${statusColors[order.status]}`}>
            {statusLabels[order.status]}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <CalendarIcon className="w-4 h-4" />
          <span>Creado el {format(new Date(order.createdAt), "PPP", { locale: es })}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información del Cliente</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{client?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                <span>{client?.city}, {client?.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                <span>{client?.phone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Productos</h3>
            <div className="space-y-2">
              {order.products.map(p => (
                <div key={p.productId} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <BoxIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{p.product.name}</span>
                  </div>
                  <span className="text-sm font-medium">x{p.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-primary">{moneyMask(order.total)}</span>
        </div>
      </CardContent>
    </Card>
  );
};