import * as z from "zod"
import { CompleteProduct, relatedProductSchema, CompleteCompany, relatedCompanySchema } from "./index"

export const productionSchema = z.object({
  id: z.number().int(),
  productId: z.number().int(),
  companyId: z.string(),
  quantity: z.number().int(),
  date: z.date(),
  createdAt: z.date(),
})

export interface CompleteProduction extends z.infer<typeof productionSchema> {
  product: CompleteProduct
  company: CompleteCompany
}

/**
 * relatedProductionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductionSchema: z.ZodSchema<CompleteProduction> = z.lazy(() => productionSchema.extend({
  product: relatedProductSchema,
  company: relatedCompanySchema,
}))
