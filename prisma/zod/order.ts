import * as z from "zod"
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client"
import { CompleteClient, relatedClientSchema, CompleteUser, relatedUserSchema, CompleteCompany, relatedCompanySchema, CompleteOrderProduct, relatedOrderProductSchema } from "./index"

export const orderSchema = z.object({
  id: z.number().int(),
  status: z.nativeEnum(OrderStatus),
  isConfirmed: z.boolean(),
  toDeliverAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deliveredAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
  clientId: z.string(),
  userId: z.string(),
  companyId: z.string(),
  total: z.number().int(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentStatus: z.nativeEnum(PaymentStatus),
  paidAt: z.date().nullish(),
})

export interface CompleteOrder extends z.infer<typeof orderSchema> {
  client: CompleteClient
  user: CompleteUser
  company: CompleteCompany
  products: CompleteOrderProduct[]
}

/**
 * relatedOrderSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedOrderSchema: z.ZodSchema<CompleteOrder> = z.lazy(() => orderSchema.extend({
  client: relatedClientSchema,
  user: relatedUserSchema,
  company: relatedCompanySchema,
  products: relatedOrderProductSchema.array(),
}))
