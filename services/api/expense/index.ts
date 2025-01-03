import { CompanyExpenseRepository } from "@/repositories";
import { CreateCompanyExpenseDTO, UpdateCompanyExpenseDTO } from "@/types/expense";

export default class APIExpenseService {
  static async findAllByCompanyId(companyId: string) {
    const expenses = await CompanyExpenseRepository.findCompanyExpensesByCompanyId(companyId);
    return expenses;
  }
  static async create(expense: CreateCompanyExpenseDTO) {
    const newExpense = await CompanyExpenseRepository.createCompanyExpense(expense);
    return newExpense;
  }
  
  static async update(id: number, expense: UpdateCompanyExpenseDTO) {
    const currentExpense = await CompanyExpenseRepository.findCompanyExpenseById(id);
    if (!currentExpense) throw new Error("Expense not found");

    const currentPrice = currentExpense.histories?.find(history => history.validTo === null);

    if(
      !currentPrice ||
      (currentPrice && Number(currentPrice.amount) !== Number(expense.amount))
    ) {
      const updatedExpense = await CompanyExpenseRepository.updateCompanyExpenseAmount(id, expense);
      return updatedExpense;
    }

    const updatedExpense = await CompanyExpenseRepository.updateCompanyExpenseInfo(id, expense);
    return updatedExpense;
  }

  static async delete(expenseId: number) {
    const deletedExpense = await CompanyExpenseRepository.deleteCompanyExpense(expenseId);
    return deletedExpense;
  }

  static async disableExpense(expenseId: number) {
    const disabledExpense = await CompanyExpenseRepository.disableCompanyExpense(expenseId);
    return disabledExpense;
  }

  static async findAllByCompanyIdAndDate(companyId: string, startDate: Date, endDate: Date) {
    const expenses = await CompanyExpenseRepository.findCompanyExpensesByCompanyIdAndDate(companyId, startDate, endDate);
    return expenses;
  }
}
