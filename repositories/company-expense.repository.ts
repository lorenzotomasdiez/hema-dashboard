import { db } from "@/lib/db";
import { CreateCompanyExpenseDTO, UpdateCompanyExpenseDTO } from "@/types/expense";
import { Decimal } from "@prisma/client/runtime/library";

export async function findCompanyExpenseById(expenseId: number) {
  const expense = await db.companyExpense.findUnique({
    where: { id: expenseId },
    include: { histories: true }
  });
  return expense;
}

export async function findCompanyExpensesByCompanyId(companyId: string, targetDate?: string) {
  const expenses = await db.companyExpense.findMany({
    where: {
      companyId,
      deletedAt: null,
    },
    include: {
      histories: {
        where: targetDate ? {
          OR: [
            {
              validTo: null,
            },
            {
              validTo: {
                gt: targetDate
              }
            }
          ],
          validFrom: {
            lte: targetDate
          }
        } : {
          validTo: null
        },
        orderBy: {
          validFrom: 'desc'
        },
        take: 1
      }
    }
  });
  return expenses;
}

export async function createCompanyExpense(expense: CreateCompanyExpenseDTO) {
  const newExpense = await db.companyExpense.create({
    data: {
      name: expense.name,
      description: expense.description,
      companyId: expense.companyId,
      isMonthly: expense.isMonthly,
      category: expense.category,
      histories: {
        create: {
          amount: new Decimal(expense.amount),
          validFrom: new Date().toISOString(),
          ...(expense.isMonthly ? { validTo: null } : { validTo: new Date().toISOString() })
        }
      }
    },
    include: {
      histories: true
    }
  });
  return newExpense;
}

export async function updateCompanyExpenseInfo(expenseId: number, expense: UpdateCompanyExpenseDTO) {
  const updatedExpense = await db.companyExpense.update({
    where: { id: expenseId },
    data: {
      name: expense.name,
      description: expense.description,
      category: expense.category,
      isMonthly: expense.isMonthly,
    },
  });
  return updatedExpense;
}

export async function updateCompanyExpenseAmount(expenseId: number, expense: UpdateCompanyExpenseDTO) {
  return db.$transaction(async (tx) => {
    await tx.companyExpense.update({
      where: { id: expenseId },
      data: {
        name: expense.name,
        description: expense.description,
        category: expense.category,
        isMonthly: expense.isMonthly,
        histories: {
          updateMany:{
            where: { validTo: null },
            data: { validTo: new Date().toISOString() }
          }
        }
      }
    });
    await tx.companyExpenseHistory.create({
      data: {
        companyExpenseId: expenseId,
        amount: new Decimal(expense.amount),
        validFrom: new Date().toISOString()
      }
    });
  });
}

export async function deleteCompanyExpense(expenseId: number) {
  const deletedExpense = await db.companyExpense.update({
    where: { id: expenseId },
    data: { 
      deletedAt: new Date(),
      histories: {
        updateMany: {
          where: { validTo: null },
          data: { validTo: new Date().toISOString() }
        }
      }
    }
  });
  return deletedExpense;
}

export async function disableCompanyExpense(expenseId: number) {
  const disabledExpense = await db.companyExpense.update({
    where: { id: expenseId },
    data: {
      histories: {
        updateMany: {
          where: { validTo: null },
          data: { validTo: new Date().toISOString() }
        }
      }
    }
  });
  return disabledExpense;
}

export async function findCompanyExpensesByCompanyIdAndDate(
  companyId: string, 
  startDate: Date, 
  endDate: Date
) {
  const expenses = await db.companyExpense.findMany({
    where: {
      companyId,
      deletedAt: null,
    },
    include: {
      histories: {
        where: {
          OR: [
            {
              validFrom: { lte: endDate },
              validTo: null
            },
            {
              validFrom: { lte: endDate },
              validTo: { gte: startDate }
            }
          ]
        }
      }
    }
  });

  return expenses.filter(expense => 
    expense.isMonthly || expense.histories?.some(history => 
      history.validFrom <= endDate && 
      (!history.validTo || history.validTo >= startDate)
    )
  );
}