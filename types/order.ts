import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client"
import { z } from "zod";
import { CompleteOrderProduct, orderSchema } from "@/prisma/zod";
import { createOrderSchema, updateOrderSchema } from "@/dto/order/create-order.dto";

export type GetOrdersParams = {
  page: number;
  per_page: number;
  status: OrderStatus | "ALL";
  keyword?: string;
  forToday?: boolean;
  isConfirmed?: boolean;
}

export type Order = z.infer<typeof orderSchema>;

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;

export type UpdateOrderDTO = z.infer<typeof updateOrderSchema>;

export interface OrderWithProducts extends Order {
  products: CompleteOrderProduct[];
  client: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
};

export type GetOrdersResponse = {
  orders: OrderWithProducts[];
  ordersCount: number;
}

export interface UpdateOrderStatusProps {
  id: number;
  status: OrderStatus;
}

type PaymentStatusLabelType = { [K in PaymentStatus]: string }

type PaymentMethodLabelType = { [K in PaymentMethod]: string }

export const PaymentStatusLabel: PaymentStatusLabelType = {
  [PaymentStatus.PAID]: "Pagado",
  [PaymentStatus.PENDING]: "Pendiente"
}

export const PaymentMethodLabel: PaymentMethodLabelType = {
  [PaymentMethod.CASH]: "Efectivo",
  [PaymentMethod.TRANSFER]: "Transferencia / Alias Mercado Pago",
  [PaymentMethod.QRPOINT]: "QR Point",
  [PaymentMethod.CARD]: "Tarjeta Debito",
}

export interface OrderMarkAsDeliveredProps {
  id: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
}