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
    if(order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
      // TO DO: Update stock remove quantity from stock
    }else{
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
}
