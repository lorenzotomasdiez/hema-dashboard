import { API_ROUTES } from "@/lib/api/routes";
import { responseHandler } from "../request";
import { CreateCompanyExpenseDTO } from "@/types/expense";

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