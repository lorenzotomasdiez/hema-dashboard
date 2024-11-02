import * as z from "zod"
import { Decimal } from "decimal.js"
import { CompleteCompany, relatedCompanySchema, CompleteProductCostComponent, relatedProductCostComponentSchema } from "./index"

// Helper schema for Decimal fields
z
  .instanceof(Decimal)
  .or(z.string())
  .or(z.number())
  .refine((value) => {
    try {
      return new Decimal(value)
    } catch (error) {
      return false
    }
  })
  .transform((value) => new Decimal(value))

export const costComponentSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  cost: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  companyId: z.string(),
  deletedAt: z.date().nullish(),
  disabledFrom: z.date().nullish(),
})

export interface CompleteCostComponent extends z.infer<typeof costComponentSchema> {
  company: CompleteCompany
  products: CompleteProductCostComponent[]
}

/**
 * relatedCostComponentSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCostComponentSchema: z.ZodSchema<CompleteCostComponent> = z.lazy(() => costComponentSchema.extend({
  company: relatedCompanySchema,
  products: relatedProductCostComponentSchema.array(),
}))
