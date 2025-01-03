import { z } from "zod";
import { createCompanyExpenseSchema } from "@/dto/expense/create-company-expense";
import { CompanyExpense, CompanyExpenseHistory } from "@prisma/client";
import { updateCompanyExpenseSchema } from "@/dto/expense/update-company-expense";

export type CreateCompanyExpenseDTO = z.infer<typeof createCompanyExpenseSchema>;
export type UpdateCompanyExpenseDTO = z.infer<typeof updateCompanyExpenseSchema>;

export interface CompanyExpenseComplete extends CompanyExpense {
  histories: CompanyExpenseHistory[];
}