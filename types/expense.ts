import { z } from "zod";
import { createCompanyExpenseSchema } from "@/dto/expense/create-company-expense";

export type CreateCompanyExpenseDTO = z.infer<typeof createCompanyExpenseSchema>;
