import * as z from "zod"
import { OrderStatus } from "@prisma/client"
import { CompleteClient, relatedClientSchema, CompleteUser, relatedUserSchema, CompleteOrderProduct, relatedOrderProductSchema, CompleteCompany, relatedCompanySchema } from "./index"

export const orderSchema = z.object({
  id: z.number().int(),
  status: z.nativeEnum(OrderStatus),
  toDeliverAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deliveredAt: z.date().nullish(),
  clientId: z.string(),
  userId: z.string(),
  companyId: z.string(),
})

export interface CompleteOrder extends z.infer<typeof orderSchema> {
  client: CompleteClient
  user: CompleteUser
  products: CompleteOrderProduct[]
  company: CompleteCompany
}

/**
 * relatedOrderSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedOrderSchema: z.ZodSchema<CompleteOrder> = z.lazy(() => orderSchema.extend({
  client: relatedClientSchema,
  user: relatedUserSchema,
  products: relatedOrderProductSchema.array(),
  company: relatedCompanySchema,
}))
