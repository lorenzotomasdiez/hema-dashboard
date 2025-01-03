import { API_ROUTES } from "@/lib/api/routes";
import { responseHandler } from "../request";
import { CreateCompanyExpenseDTO, UpdateCompanyExpenseDTO } from "@/types/expense";

export const getCompanyExpenses = async () => {
  const res = await fetch(API_ROUTES.expenses.root);
  return await responseHandler(res);
}

export const addCompanyExpense = async (expense: CreateCompanyExpenseDTO) => {
  const res = await fetch(API_ROUTES.expenses.root, {
    method: "POST",
    body: JSON.stringify(expense)
  });
  return await responseHandler(res);
}

export const updateCompanyExpense = async (expense: UpdateCompanyExpenseDTO) => {
  const res = await fetch(API_ROUTES.expenses.id(expense.id), {
    method: "PATCH",
    body: JSON.stringify(expense)
  });
  return await responseHandler(res);
}

export const deleteCompanyExpense = async (expenseId: number) => {
  const res = await fetch(API_ROUTES.expenses.root + `/${expenseId}`, {
    method: "DELETE"
  });
  return await responseHandler(res);
}

export const disableCompanyExpense = async (expenseId: number) => {
  const res = await fetch(API_ROUTES.expenses.root + `/disable/${expenseId}`, {
    method: "DELETE"
  });
  return await responseHandler(res);
}
