import { z } from "zod";
import { OrderStatus } from "@prisma/client"

export const createOrderProductSchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int(),
})


export const createOrderSchema = z.object({
  clientId: z.string().cuid(),
  status: z.nativeEnum(OrderStatus).optional(),
  toDeliverAt: z.date().optional(),
  products: z.array(createOrderProductSchema),
  deliveredAt: z.date().optional(),
})

export const updateOrderSchema = z.object({
  id: z.number().int(),
  ...createOrderSchema.shape,
})