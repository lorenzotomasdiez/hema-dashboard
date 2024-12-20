import { OrderRepository } from "@/repositories";
import { CreateOrderDTO, GetOrdersParams, OrderComplete, UpdateOrderDTO } from "@/types";
import { OrderStatus } from "@prisma/client";

export default class APIOrderService {
  static async getAllOrders(companyId: string, params: GetOrdersParams, timezone: string) {
    const orders = await OrderRepository.findAllByCompanyIdPaginated(companyId, params, timezone);
    const ordersCount = await OrderRepository.ordersCountByCompanyId(companyId, params);
    return { orders, ordersCount };
  }

  static async changeStatus(id: number, status: OrderStatus) {
    const order = await OrderRepository.changeStatus(id, status);
    if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
      // TO DO: Update stock remove quantity from stock
    } else {
      // TO DO: Update stock add quantity to stock
    }
    return order;
  }

  static async createOrder(createOrderDto: CreateOrderDTO, companyId: string, userId: string) {
    const newOrder = await OrderRepository.create(createOrderDto, companyId, userId);
    // TO DO: Depending on the status, update the stock
    return newOrder;
  }

  static async getOrderById(id: number, companyId: string): Promise<OrderComplete | null> {
    const order = await OrderRepository.findById(id, companyId);
    return order;
  }

  static async updateOrder(id: number, updateOrderDto: UpdateOrderDTO, companyId: string) {
    const order = await OrderRepository.update(id, updateOrderDto, companyId);
    // TO DO: Handle status and stock update
    return order;
  }

  static async markAsDelivered(orderIds: number[]) {
    const orders = await OrderRepository.markAsDelivered(orderIds);
    return orders;
  }

  static async getMonthlyTotalIncome(startDate: Date, endDate: Date, companyId: string) {
    const totalIncome = await OrderRepository.getMonthlyTotalIncome(startDate, endDate, companyId);
    return totalIncome;
  }

  static async getMonthlyCount(startDate: Date, endDate: Date, companyId: string) {
    const count = await OrderRepository.getMonthlyCount(startDate, endDate, companyId);
    return count;
  }

  static async getMonthlyActiveClients(startDate: Date, endDate: Date, companyId: string) {
    const activeClients = await OrderRepository.getMonthlyActiveClients(startDate, endDate, companyId);
    return activeClients;
  }

  static async getOrderStatuses(companyId: string) {
    const orderStatuses = await OrderRepository.getOrderStatuses(companyId);
    return orderStatuses.reduce((acc, curr) => {
      acc[curr.status.toLowerCase()] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);
  }

  static async getOrdersFromDate(startDate: Date, endDate: Date, companyId: string) {
    const orders = await OrderRepository.getOrdersFromDate(startDate, endDate, companyId);
    return orders;
  }

  static async getMonthlyEarnings(startDate: Date, endDate: Date, companyId: string) {
    const orders = await this.getOrdersFromDate(startDate, endDate, companyId);
    const totalEarnings = orders.reduce((acc, order) => {
      const orderTotal = order.products.reduce((acc, product) => acc + product.price * product.quantity, 0);
      const orderCosts = order.products.reduce(
        (acc, product) => acc + product.product.costComponents.reduce(
          (acc, cost) => acc + Number(cost.costComponent.cost) * product.quantity, 0
        ), 0
      );
      return acc + orderTotal - orderCosts;
    }, 0);
    return totalEarnings;
  }
}
