import { DashboardSummaryData } from "@/types";

export const mockedData: DashboardSummaryData = {
  totalIncome: {
    currentMonth: 43522,
    previousMonth: 23322,
  },
  newOrders: {
    currentMonth: 20,
    previousMonth: 15,
  },
  totalActiveClients: {
    currentMonth: 10,
    previousMonth: 8,
  },
  orderStatus: {
    pending: 10,
    shipped: 5,
    delivered: 3,
  },
  topProducts: [
    { name: "Hielo 5kg", sales: 120 },
    { name: "Hielo 10kg", sales: 90 },
    { name: "Hielo 15kg", sales: 70 },
    { name: "Hielo 3kg", sales: 60 },
    { name: "Hielo 20kg", sales: 50 },
  ],
}
