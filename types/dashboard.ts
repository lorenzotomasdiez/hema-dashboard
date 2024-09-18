export interface DashboardSummaryData {
  totalIncome: {
    currentMonth: number;
    previousMonth: number;
  };
  newOrders: {
    currentMonth: number;
    previousMonth: number;
  };
  totalActiveClients: {
    currentMonth: number;
    previousMonth: number;
  };
  orderStatus: {
    pending: number;
    shipped: number;
    delivered: number;
  };
  topProducts: {
    name: string;
    sales: number;
  }[];
}