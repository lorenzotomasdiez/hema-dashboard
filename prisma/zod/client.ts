import * as z from "zod"
import { CompleteOrder, relatedOrderSchema, CompleteCompany, relatedCompanySchema } from "./index"

export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().nullish(),
  address: z.string().nullish(),
  createdAt: z.date(),
  companyId: z.string(),
})

export interface CompleteClient extends z.infer<typeof clientSchema> {
  orders: CompleteOrder[]
  company: CompleteCompany
}

/**
 * relatedClientSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedClientSchema: z.ZodSchema<CompleteClient> = z.lazy(() => clientSchema.extend({
  orders: relatedOrderSchema.array(),
  company: relatedCompanySchema,
}))
