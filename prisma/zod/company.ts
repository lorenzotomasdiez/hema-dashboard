import * as z from "zod"
import { CompleteOrder, relatedOrderSchema, CompleteClient, relatedClientSchema, CompleteUserCompany, relatedUserCompanySchema, CompleteProduct, relatedProductSchema } from "./index"

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
})

export interface CompleteCompany extends z.infer<typeof companySchema> {
  orders: CompleteOrder[]
  clients: CompleteClient[]
  userCompanies: CompleteUserCompany[]
  products: CompleteProduct[]
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
  products: relatedProductSchema.array(),
}))
