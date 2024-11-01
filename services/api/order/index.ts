import { OrderRepository } from "@/repositories";
import { GetOrdersParams } from "@/types";

export default class APIOrderService {
  static async getAllOrders(companyId: string, params: GetOrdersParams, timezone: string) {
    const orders = await OrderRepository.findAllByCompanyIdPaginated(companyId, params, timezone);
    const ordersCount = await OrderRepository.ordersCountByCompanyId(companyId, params);
    return { orders, ordersCount };
  }


}