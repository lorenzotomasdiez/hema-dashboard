import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { DashboardSummaryData } from "@/types";

interface TotalIncomeResult {
  total: number | null;
}

export async function GET() {
  try {
    const { session } = await getUserAuth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const now = new Date();
    const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [currentMonthData, previousMonthData, orderStatuses, topProducts] = await Promise.all([
      getMonthlyData(firstDayOfCurrentMonth, now),
      getMonthlyData(firstDayOfPreviousMonth, firstDayOfCurrentMonth),
      getOrderStatuses(),
      getTopProducts(firstDayOfCurrentMonth, now),
    ]);

    const summary: DashboardSummaryData = {
      totalIncome: {
        currentMonth: currentMonthData.totalIncome,
        previousMonth: previousMonthData.totalIncome,
      },
      newOrders: {
        currentMonth: currentMonthData.newOrders,
        previousMonth: previousMonthData.newOrders,
      },
      totalActiveClients: {
        currentMonth: currentMonthData.totalActiveClients,
        previousMonth: previousMonthData.totalActiveClients,
      },
      orderStatus: {
        pending: orderStatuses.pending || 0,
        shipped: orderStatuses.shipped || 0,
        delivered: orderStatuses.delivered || 0,
      },
      topProducts: topProducts,
    };

    return new Response(JSON.stringify(summary), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

async function getMonthlyData(startDate: Date, endDate: Date) {
  const [totalIncomeResult, newOrders, activeClientsResult] = await Promise.all([
    db.$queryRaw<TotalIncomeResult[]>`
      SELECT SUM(p.price * op.quantity) as total
      FROM "Order" o
      JOIN "OrderProduct" op ON o.id = op."orderId"
      JOIN "Product" p ON op."productId" = p.id
      WHERE o."createdAt" >= ${startDate} AND o."createdAt" < ${endDate}
    `,
    db.order.count({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    }),
    db.order.groupBy({
      by: ['clientId'],
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    }).then((result) => result.length),
  ]);

  const totalIncome = totalIncomeResult.length > 0 && totalIncomeResult[0].total !== null
    ? Number(totalIncomeResult[0].total)
    : 0;

  return {
    totalIncome,
    newOrders,
    totalActiveClients: activeClientsResult,
  };
}

async function getOrderStatuses() {
  const statuses = await db.order.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  });

  return statuses.reduce((acc, curr) => {
    acc[curr.status.toLowerCase()] = curr._count.status;
    return acc;
  }, {} as Record<string, number>);
}

async function getTopProducts(startDate: Date, endDate: Date) {
  const topProducts = await db.orderProduct.groupBy({
    by: ['productId'],
    where: {
      order: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 5,
  });

  const productIds = topProducts.map(p => p.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });

  return topProducts.map((product) => ({
    name: products.find(p => p.id === product.productId)?.name || 'Unknown',
    sales: product._sum.quantity || 0,
  }));
}


