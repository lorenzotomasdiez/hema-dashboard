import { db } from "@/lib/db";
import { CreateCompanyExpenseDTO } from "@/types/expense";
import { Decimal } from "@prisma/client/runtime/library";

export async function findCompanyExpensesByCompanyId(companyId: string) {
  const expenses = await db.companyExpense.findMany({
    where: {
      companyId
    },
  });
  return expenses;
}

export async function createCompanyExpense(expense: CreateCompanyExpenseDTO) {
  const newExpense = await db.companyExpense.create({
    data: {
      ...expense,
      amount: new Decimal(expense.amount)
    }
  });
  return newExpense;
}
