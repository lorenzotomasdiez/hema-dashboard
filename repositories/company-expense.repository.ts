import { db } from "@/lib/db";
import { CreateCompanyExpenseDTO } from "@/types/expense";
import { Decimal } from "@prisma/client/runtime/library";

export async function findCompanyExpensesByCompanyId(companyId: string, targetDate?: string) {
  const expenses = await db.companyExpense.findMany({
    where: {
      companyId,
      deletedAt: null,
      ...(targetDate ? {
        OR: [
          { disabledFrom: null },
          { disabledFrom: { gt: targetDate } }
        ]
      } : {
        disabledFrom: null
      })
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

export async function deleteCompanyExpense(expenseId: number) {
  const deletedExpense = await db.companyExpense.update({
    where: { id: expenseId },
    data: { deletedAt: new Date() }
  });
  return deletedExpense;
}

export async function disableCompanyExpense(expenseId: number) {
  const disabledExpense = await db.companyExpense.update({
    where: { id: expenseId },
    data: { disabledFrom: new Date() }
  });
  return disabledExpense;
}

export async function findCompanyExpensesByCompanyIdAndDate(companyId: string, startDate: Date, endDate: Date) {
  const expenses = await db.companyExpense.findMany({
    where: {
      companyId,
      deletedAt: null,
      OR: [
        { disabledFrom: null, isMonthly: true },
        { date: { gte: startDate, lte: endDate } }
      ]
    },
  });
  return expenses;
}