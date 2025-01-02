import { z } from "zod";
import { createOrderProductSchema } from "./create-order.dto";
import { OrderStatus, PaymentMethod } from "@prisma/client";
import { PaymentStatus } from "@prisma/client";

export const createSellSchema = z.object({
  clientId: z.string({ message: "El cliente es requerido" }).cuid({ message: "El cliente es requerido" }),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.DELIVERED),
  products: z.array(createOrderProductSchema).min(1, { message: "Debe haber al menos un producto" }),
  isConfirmed: z.boolean().default(true),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentStatus: z.nativeEnum(PaymentStatus),
})

export type CreateSellType = z.infer<typeof createSellSchema>;