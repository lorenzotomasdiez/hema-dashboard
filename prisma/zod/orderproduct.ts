import * as z from "zod"
import { CompleteOrder, relatedOrderSchema, CompleteProduct, relatedProductSchema } from "./index"

export const orderProductSchema = z.object({
  orderId: z.number().int(),
  productId: z.number().int(),
  quantity: z.number().int(),
  price: z.number().int(),
})

export interface CompleteOrderProduct extends z.infer<typeof orderProductSchema> {
  order: CompleteOrder
  product: CompleteProduct
}

/**
 * relatedOrderProductSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedOrderProductSchema: z.ZodSchema<CompleteOrderProduct> = z.lazy(() => orderProductSchema.extend({
  order: relatedOrderSchema,
  product: relatedProductSchema,
}))
