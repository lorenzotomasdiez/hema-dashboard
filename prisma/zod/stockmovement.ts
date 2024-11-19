import * as z from "zod"
import { StockMovementType } from "@prisma/client"
import { CompleteProduct, relatedProductSchema, CompleteCompany, relatedCompanySchema } from "./index"

export const stockMovementSchema = z.object({
  id: z.number().int(),
  productId: z.number().int(),
  companyId: z.string(),
  quantity: z.number().int(),
  movementType: z.nativeEnum(StockMovementType),
  date: z.date(),
  createdAt: z.date(),
})

export interface CompleteStockMovement extends z.infer<typeof stockMovementSchema> {
  product: CompleteProduct
  company: CompleteCompany
}

/**
 * relatedStockMovementSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedStockMovementSchema: z.ZodSchema<CompleteStockMovement> = z.lazy(() => stockMovementSchema.extend({
  product: relatedProductSchema,
  company: relatedCompanySchema,
}))
