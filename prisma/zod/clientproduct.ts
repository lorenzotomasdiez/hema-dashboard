import * as z from "zod"
import { CompleteClient, relatedClientSchema, CompleteProduct, relatedProductSchema } from "./index"

export const clientProductSchema = z.object({
  id: z.number().int(),
  clientId: z.string(),
  productId: z.number().int(),
  price: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
})

export interface CompleteClientProduct extends z.infer<typeof clientProductSchema> {
  client: CompleteClient
  product: CompleteProduct
}

/**
 * relatedClientProductSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedClientProductSchema: z.ZodSchema<CompleteClientProduct> = z.lazy(() => clientProductSchema.extend({
  client: relatedClientSchema,
  product: relatedProductSchema,
}))
