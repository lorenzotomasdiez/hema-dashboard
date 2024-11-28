import { CompanyExpenseRepository } from "@/repositories";
import { CreateCompanyExpenseDTO } from "@/types/expense";

export default class APIExpenseService {
  static async findAllByCompanyId(companyId: string) {
    const expenses = await CompanyExpenseRepository.findCompanyExpensesByCompanyId(companyId);
    return expenses;
  }
  static async create(expense: CreateCompanyExpenseDTO) {
    const newExpense = await CompanyExpenseRepository.createCompanyExpense(expense);
    return newExpense;
  }

  static async delete(expenseId: number) {
    const deletedExpense = await CompanyExpenseRepository.deleteCompanyExpense(expenseId);
    return deletedExpense;
  }

  static async disableExpense(expenseId: number) {
    const disabledExpense = await CompanyExpenseRepository.disableCompanyExpense(expenseId);
    return disabledExpense;
  }
}