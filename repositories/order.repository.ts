import { db } from "@/lib/db/index";
import { GetOrdersParams } from "@/types";
import { OrderStatus } from "@prisma/client";


export async function findAllByCompanyIdPaginated(companyId: string, params: GetOrdersParams, timezone: string) {
  const { page, per_page, status, forToday, keyword } = params;
  return db.order.findMany({
    skip: page * per_page,
    take: per_page,
    where: {
      companyId,
      ...(status !== "ALL" && { status: OrderStatus[status as OrderStatus] }),
      ...(forToday && {
        toDeliverAt: {
          gte: new Date(new Date(new Date().toLocaleString("en-US", { timeZone: timezone })).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(new Date().toLocaleString("en-US", { timeZone: timezone })).setHours(23, 59, 59, 999))
        }
      }),
      ...(keyword && { client: { name: { contains: keyword, mode: 'insensitive' } } }),
    },
    orderBy: [
      {
        createdAt: "desc"
      }
    ],
    include: {
      products: {
        include: {
          product: true
        }
      },
    },
  });
}

export async function ordersCountByCompanyId(companyId: string, params: GetOrdersParams) {
  const { status, forToday, keyword } = params;
  return db.order.count({
    where: {
      ...(status !== "ALL" && { status: OrderStatus[status as OrderStatus] }),
      ...(forToday && { toDeliverAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)), lte: new Date(new Date().setHours(23, 59, 59, 999)) } }),
      ...(keyword && { client: { name: { contains: keyword, mode: 'insensitive' } } }),
      companyId,
    }
  });
}

export async function changeStatus(id: number, status: OrderStatus) {
  return db.order.update({
    where: { id },
    data: { status: OrderStatus[status as OrderStatus] },
    include: {
      products: {
        include: {
          product: true
        }
      },
    }
  });
}