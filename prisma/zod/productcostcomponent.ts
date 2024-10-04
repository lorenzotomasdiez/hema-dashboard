import * as z from "zod"
import { Decimal } from "decimal.js"
import { CompleteProduct, relatedProductSchema } from "./index"

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

export const productCostComponentSchema = z.object({
  id: z.number().int(),
  productId: z.number().int(),
  name: z.string(),
  cost: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteProductCostComponent extends z.infer<typeof productCostComponentSchema> {
  product: CompleteProduct
}

/**
 * relatedProductCostComponentSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductCostComponentSchema: z.ZodSchema<CompleteProductCostComponent> = z.lazy(() => productCostComponentSchema.extend({
  product: relatedProductSchema,
}))
