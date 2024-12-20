import { DashboardSummaryData } from "@/types";
import APIOrderService from "../order";
import APIExpenseService from "../expense";

export default class APIDashboardService {
  static async getDashboardData(companyId: string) {

    const now = new Date();
    const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      currentMonthData, 
      previousMonthData, 
      currentMonthEarnings, 
      previousMonthEarnings, 
      orderStatuses
    ] = await Promise.all([
      this.getMonthlyStats(firstDayOfCurrentMonth, now, companyId),
      this.getMonthlyStats(firstDayOfPreviousMonth, firstDayOfCurrentMonth, companyId),
      this.getMonthlyEarnings(firstDayOfCurrentMonth, now, companyId),
      this.getMonthlyEarnings(firstDayOfPreviousMonth, firstDayOfCurrentMonth, companyId),
      this.getOrderStatuses(companyId),
    ]);

    const summary: DashboardSummaryData = {
      totalIncome: {
        currentMonth: currentMonthData.totalIncome || 0,
        previousMonth: previousMonthData.totalIncome || 0,
      },
      newOrders: {
        currentMonth: currentMonthData.count || 0,
        previousMonth: previousMonthData.count || 0,
      },
      totalActiveClients: {
        currentMonth: currentMonthData.activeClients.length || 0,
        previousMonth: previousMonthData.activeClients.length || 0,
      },
      orderStatus: {
        pending: orderStatuses.pending || 0,
        shipped: orderStatuses.shipped || 0,
        delivered: orderStatuses.delivered || 0,
      },
      totalEarnings: {
        currentMonth: currentMonthEarnings || 0,
        previousMonth: previousMonthEarnings || 0,
      },
    };

    return summary;
  }

  static async getMonthlyStats(startDate: Date, endDate: Date, companyId: string) {
    const [totalIncome, count, activeClients] = await Promise.all([
      APIOrderService.getMonthlyTotalIncome(startDate, endDate, companyId),
      APIOrderService.getMonthlyCount(startDate, endDate, companyId),
      APIOrderService.getMonthlyActiveClients(startDate, endDate, companyId),
    ]);
    return {
      totalIncome,
      count,
      activeClients,
    }
  }

  static async getMonthlyEarnings(startDate: Date, endDate: Date, companyId: string) {
    const earnings = await APIOrderService.getMonthlyEarnings(startDate, endDate, companyId);
    const expensesTotal = await this.getMonthlyExpenses(startDate, endDate, companyId);
    return earnings - expensesTotal;
  }

  static async getMonthlyExpenses(startDate: Date, endDate: Date, companyId: string) {
    const expenses = await APIExpenseService.findAllByCompanyIdAndDate(companyId, startDate, endDate);
    return expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
  }

  static async getOrderStatuses(companyId: string) {
    const orderStatuses = await APIOrderService.getOrderStatuses(companyId);
    return orderStatuses;
  }
}
