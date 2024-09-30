import { z } from "zod";
import { OrderStatus } from "@prisma/client"

export const createOrderSchema = z.object({
  clientId: z.string().cuid(),
  status: z.nativeEnum(OrderStatus).optional(),
  toDeliverAt: z.date().optional(),
  products: z.array(z.object({
    productId: z.number().int(),
    quantity: z.number().int(),
  }))
})
