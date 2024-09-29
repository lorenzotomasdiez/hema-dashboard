import * as z from "zod"
import { CompleteOrder, relatedOrderSchema, CompleteClient, relatedClientSchema, CompleteUserCompany, relatedUserCompanySchema } from "./index"

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteCompany extends z.infer<typeof companySchema> {
  orders: CompleteOrder[]
  clients: CompleteClient[]
  userCompanies: CompleteUserCompany[]
}

/**
 * relatedCompanySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCompanySchema: z.ZodSchema<CompleteCompany> = z.lazy(() => companySchema.extend({
  orders: relatedOrderSchema.array(),
  clients: relatedClientSchema.array(),
  userCompanies: relatedUserCompanySchema.array(),
}))
