import { OrderRepository } from "@/repositories";
import { GetOrdersParams } from "@/types";
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

}