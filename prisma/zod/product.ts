import * as z from "zod"
import { CompleteProduction, relatedProductionSchema, CompleteStockMovement, relatedStockMovementSchema, CompleteOrderProduct, relatedOrderProductSchema, CompleteCompany, relatedCompanySchema, CompleteProductCostComponent, relatedProductCostComponentSchema } from "./index"

export const productSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullish(),
  stock: z.number().int(),
  slug: z.string(),
  price: z.number().int(),
  companyId: z.string(),
  deletedAt: z.date().nullish(),
})

export interface CompleteProduct extends z.infer<typeof productSchema> {
  productions: CompleteProduction[]
  stockMovements: CompleteStockMovement[]
  orders: CompleteOrderProduct[]
  company: CompleteCompany
  costComponents: CompleteProductCostComponent[]
}

/**
 * relatedProductSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductSchema: z.ZodSchema<CompleteProduct> = z.lazy(() => productSchema.extend({
  productions: relatedProductionSchema.array(),
  stockMovements: relatedStockMovementSchema.array(),
  orders: relatedOrderProductSchema.array(),
  company: relatedCompanySchema,
  costComponents: relatedProductCostComponentSchema.array(),
}))
