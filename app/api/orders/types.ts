import { z } from "zod";
import { orderSchema } from "@/prisma/zod";
import { OrderType, OrderStatus } from "@prisma/client"

export const createOrderSchema = z.object({
  type: z.nativeEnum(OrderType),
  quantity: z.number().int(),
  clientId: z.string().cuid(),
  status: z.nativeEnum(OrderStatus).optional(),
  deliveredAt: z.date().optional(),
  error: z.string().optional()
})

export type CreateOrderType = z.infer<typeof createOrderSchema>;

export type Order = z.infer<typeof orderSchema>;

export enum OrderTypes {
  "KG3" = "3 KG",
  "KG5" = "5 KG",
  "KG10" = "10 KG",
}

export type GetOrdersParams = {
  page: number;
  per_page: number;
  status: OrderStatus | "ALL";
}