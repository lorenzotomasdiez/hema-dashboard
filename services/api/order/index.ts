import { OrderRepository } from "@/repositories";
import { CreateOrderDTO, GetOrdersParams, OrderComplete, UpdateOrderDTO } from "@/types";
import { StockRepository } from "@/repositories";

export default class APIOrderService {
  static async getAllOrders(companyId: string, params: GetOrdersParams, timezone: string) {
    const orders = await OrderRepository.findAllByCompanyIdPaginated(companyId, params, timezone);
    const ordersCount = await OrderRepository.ordersCountByCompanyId(companyId, params);
    return { orders, ordersCount };
  }

  static async createOrder({
    createOrderDto,
    companyId,
    userId,
    isStockSystemEnabled
  }: {
    createOrderDto: CreateOrderDTO,
    companyId: string,
    userId: string,
    isStockSystemEnabled: boolean
  }) {
    const newOrder = await OrderRepository.create(createOrderDto, companyId, userId);
    if (isStockSystemEnabled) {
      const shouldDecreaseStock = newOrder.status === 'SHIPPED' || newOrder.status === 'DELIVERED';

      if (shouldDecreaseStock) {
        const productsStock = await StockRepository.findAllProductAndStockByIds(
          newOrder.products.map(p => p.productId),
          companyId
        );

        for (const item of newOrder.products) {
          const product = productsStock.find(p => p.id === item.productId);
          if (product) {
            const newStockValue = product.stock - item.quantity;
            await StockRepository.updateStockProduct(item.productId, companyId, newStockValue);

            await StockRepository.createStockMovement({
              productId: item.productId,
              companyId: companyId,
              movementValue: -item.quantity,
              movementType: 'PURCHASE',
              description: `Venta - Orden #${newOrder.id}`,
              userId: userId,
              finalStock: newStockValue
            });
          }
        }
      }
    }
    return newOrder;
  }

  static async getOrderById(id: number, companyId: string): Promise<OrderComplete | null> {
    const order = await OrderRepository.findById(id, companyId);
    return order;
  }

  static async getOrdersByIds(orderIds: number[], companyId: string) {
    const orders = await OrderRepository.findByIds(orderIds, companyId);
    return orders;
  }

  static async updateOrder({
    id,
    updateOrderDto,
    companyId,
    isStockSystemEnabled
  }: {
    id: number,
    updateOrderDto: UpdateOrderDTO,
    companyId: string,
    isStockSystemEnabled: boolean
  }) {
    if (isStockSystemEnabled) {
      const currentOrder = await OrderRepository.findById(id, companyId);
      const order = await OrderRepository.update(id, updateOrderDto, companyId);

      const shouldUpdateStock = currentOrder && order && updateOrderDto.status && currentOrder.status !== updateOrderDto.status;

      if (shouldUpdateStock) {
        const shouldDecreaseStock = currentOrder.status === 'PENDING' &&
          (updateOrderDto.status === 'SHIPPED' || updateOrderDto.status === 'DELIVERED');

        const shouldIncreaseStock = (currentOrder.status === 'SHIPPED' || currentOrder.status === 'DELIVERED') &&
          updateOrderDto.status === 'PENDING';

        if (shouldDecreaseStock) {
          const productsStock = await StockRepository.findAllProductAndStockByIds(currentOrder.products.map(p => p.productId), companyId);
          for (const item of currentOrder.products) {
            const product = productsStock.find(p => p.id === item.productId);
            if (product) {
              const newStockValue = product.stock - item.quantity;
              await StockRepository.updateStockProduct(item.productId, companyId, newStockValue);

              await StockRepository.createStockMovement({
                productId: item.productId,
                companyId: companyId,
                movementValue: -item.quantity,
                movementType: 'PURCHASE',
                description: `Venta - Orden #${order.id}`,
                userId: order.userId,
                finalStock: newStockValue
              });
            }
          }
        }

        if (shouldIncreaseStock) {
          const productsStock = await StockRepository.findAllProductAndStockByIds(currentOrder.products.map(p => p.productId), companyId);
          for (const item of currentOrder.products) {
            const product = productsStock.find(p => p.id === item.productId);
            if (product) {
              const newStockValue = product.stock + item.quantity;
              await StockRepository.updateStockProduct(item.productId, companyId, newStockValue);

              await StockRepository.createStockMovement({
                productId: item.productId,
                companyId: companyId,
                movementValue: item.quantity,
                movementType: 'RETURN',
                description: `Devolución - Orden #${order.id}`,
                userId: order.userId,
                finalStock: newStockValue
              });
            }
          }
        }
      }
      return order;
    }
    return await OrderRepository.update(id, updateOrderDto, companyId);
  }

  static async markAsDelivered({
    orderIds,
    companyId,
    isStockSystemEnabled
  }: {
    orderIds: number[],
    companyId: string,
    isStockSystemEnabled: boolean
  }) {
    if (isStockSystemEnabled) {
      const currentOrders = await OrderRepository.findByIds(orderIds, companyId);
      const orders = await OrderRepository.markAsDelivered(orderIds);
      const pendingOrders = currentOrders.filter(order => order.status === 'PENDING');
      const productIds = pendingOrders.flatMap(order =>
        order.products.map(product => product.productId)
      );

      if (productIds.length > 0) {
        const productsStock = await StockRepository.findAllProductAndStockByIds(productIds, companyId);

        for (const order of pendingOrders) {
          for (const item of order.products) {
            const product = productsStock.find(p => p.id === item.productId);
            if (product) {
              const newStockValue = product.stock - item.quantity;
              await StockRepository.updateStockProduct(item.productId, companyId, newStockValue);

              await StockRepository.createStockMovement({
                productId: item.productId,
                companyId: companyId,
                movementValue: -item.quantity,
                movementType: 'PURCHASE',
                description: `Venta - Orden #${order.id} (Marcada como entregada)`,
                userId: order.userId,
                finalStock: newStockValue
              });
            }
          }
        }
      }

      return orders;
    }
    return await OrderRepository.markAsDelivered(orderIds);;
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
