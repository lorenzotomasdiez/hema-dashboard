import * as z from "zod"
import { CompleteOrderProduct, relatedOrderProductSchema } from "./index"

export const productSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullish(),
  stock: z.number().int(),
  slug: z.string(),
  price: z.number().int(),
})

export interface CompleteProduct extends z.infer<typeof productSchema> {
  orders: CompleteOrderProduct[]
}

/**
 * relatedProductSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductSchema: z.ZodSchema<CompleteProduct> = z.lazy(() => productSchema.extend({
  orders: relatedOrderProductSchema.array(),
}))
