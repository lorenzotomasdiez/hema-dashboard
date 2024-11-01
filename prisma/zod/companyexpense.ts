import * as z from "zod"
import { Decimal } from "decimal.js"
import { ExpenseCategory } from "@prisma/client"
import { CompleteCompany, relatedCompanySchema } from "./index"

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

export const companyExpenseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  companyId: z.string(),
  date: z.date(),
  amount: z.number(),
  description: z.string().nullish(),
  isMonthly: z.boolean(),
  category: z.nativeEnum(ExpenseCategory).nullish(),
})

export interface CompleteCompanyExpense extends z.infer<typeof companyExpenseSchema> {
  company: CompleteCompany
}

/**
 * relatedCompanyExpenseSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCompanyExpenseSchema: z.ZodSchema<CompleteCompanyExpense> = z.lazy(() => companyExpenseSchema.extend({
  company: relatedCompanySchema,
}))
