import * as z from "zod"
import { Decimal } from "decimal.js"
import { CompleteCompanyExpense, relatedCompanyExpenseSchema } from "./index"

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

export const companyExpenseHistorySchema = z.object({
  id: z.number().int(),
  companyExpenseId: z.number().int(),
  amount: z.number(),
  validFrom: z.date(),
  validTo: z.date().nullish(),
  createdAt: z.date(),
})

export interface CompleteCompanyExpenseHistory extends z.infer<typeof companyExpenseHistorySchema> {
  companyExpense: CompleteCompanyExpense
}

/**
 * relatedCompanyExpenseHistorySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCompanyExpenseHistorySchema: z.ZodSchema<CompleteCompanyExpenseHistory> = z.lazy(() => companyExpenseHistorySchema.extend({
  companyExpense: relatedCompanyExpenseSchema,
}))
