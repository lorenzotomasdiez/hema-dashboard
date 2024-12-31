import { OrderStatus, PaymentStatus, PaymentMethod, Product } from "@prisma/client"
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

export type OrderComplete = {
  id: number;
  status: OrderStatus;
  toDeliverAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  deliveredAt: Date | string | null;
  deletedAt: Date | string | null;
  clientId: string;
  userId: string;
  companyId: string;
  total: number;
  products: {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product: Product;
  }[];
  isConfirmed: boolean;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt: Date | string | null;
}

export interface UpdateOrderStatusProps {
  id: number;
  status: OrderStatus;
}