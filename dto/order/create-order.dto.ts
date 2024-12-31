import { z } from "zod";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client"

export const createOrderProductSchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int(),
})


export const createOrderSchema = z.object({
  clientId: z.string({ message: "El cliente es requerido" }).cuid({ message: "El cliente es requerido" }),
  status: z.nativeEnum(OrderStatus).optional(),
  toDeliverAt: z.date().optional(),
  products: z.array(createOrderProductSchema).min(1, { message: "Debe haber al menos un producto" }),
  deliveredAt: z.date().optional(),
  isConfirmed: z.boolean().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentStatus: z.nativeEnum(PaymentStatus),
})

export const updateOrderSchema = z.object({
  id: z.number().int(),
  ...createOrderSchema.shape,
})