import { ExpenseCategory } from "@prisma/client";
import { z } from "zod";

export const createCompanyExpenseSchema = z.object({
  name: z.string(),
  companyId: z.string().cuid(),
  amount: z.number(),
  description: z.string().nullish(),
  category: z.nativeEnum(ExpenseCategory).nullish(),
  isMonthly: z.boolean().optional(),
});
