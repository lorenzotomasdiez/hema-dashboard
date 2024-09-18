import { OrderStatus } from "@prisma/client"
import { z } from "zod";
import { orderSchema } from "@/prisma/zod";
import { createOrderSchema } from "@/dto/order/create-order.dto";

export type GetOrdersParams = {
  page: number;
  per_page: number;
  status: OrderStatus | "ALL";
}

export type Order = z.infer<typeof orderSchema>;
export type CreateOrderType = z.infer<typeof createOrderSchema>;

export type OrderWithProducts = {
  id: number;
  status: OrderStatus;
  createdAt: Date;
  products: {
    id: number;
    name: string;
    quantity: number;
  }[];
  price: number;
};