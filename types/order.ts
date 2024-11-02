import { OrderStatus } from "@prisma/client"
import { z } from "zod";
import { CompleteOrderProduct, orderSchema } from "@/prisma/zod";
import { createOrderSchema } from "@/dto/order/create-order.dto";

export type GetOrdersParams = {
  page: number;
  per_page: number;
  status: OrderStatus | "ALL";
  keyword?: string;
  forToday?: boolean;
}

export type Order = z.infer<typeof orderSchema>;
export type CreateOrderType = z.infer<typeof createOrderSchema>;

export interface OrderWithProducts extends Order {
  products: CompleteOrderProduct[];
};

export type GetOrdersResponse = {
  orders: OrderWithProducts[];
  ordersCount: number;
}

export interface UpdateOrderStatusProps {
  id: number;
  status: OrderStatus;
}