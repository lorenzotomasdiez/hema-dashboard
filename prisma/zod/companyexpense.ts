import * as z from "zod"
import { ExpenseCategory } from "@prisma/client"
import { CompleteCompany, relatedCompanySchema, CompleteCompanyExpenseHistory, relatedCompanyExpenseHistorySchema } from "./index"

export const companyExpenseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  companyId: z.string(),
  description: z.string().nullish(),
  isMonthly: z.boolean(),
  category: z.nativeEnum(ExpenseCategory).nullish(),
  deletedAt: z.date().nullish(),
})

export interface CompleteCompanyExpense extends z.infer<typeof companyExpenseSchema> {
  company: CompleteCompany
  histories: CompleteCompanyExpenseHistory[]
}

/**
 * relatedCompanyExpenseSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCompanyExpenseSchema: z.ZodSchema<CompleteCompanyExpense> = z.lazy(() => companyExpenseSchema.extend({
  company: relatedCompanySchema,
  histories: relatedCompanyExpenseHistorySchema.array(),
}))
