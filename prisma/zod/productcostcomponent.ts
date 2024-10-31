import * as z from "zod"
import { CompleteProduct, relatedProductSchema, CompleteCostComponent, relatedCostComponentSchema } from "./index"

export const productCostComponentSchema = z.object({
  id: z.number().int(),
  productId: z.number().int(),
  costComponentId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteProductCostComponent extends z.infer<typeof productCostComponentSchema> {
  product: CompleteProduct
  costComponent: CompleteCostComponent
}

/**
 * relatedProductCostComponentSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductCostComponentSchema: z.ZodSchema<CompleteProductCostComponent> = z.lazy(() => productCostComponentSchema.extend({
  product: relatedProductSchema,
  costComponent: relatedCostComponentSchema,
}))
