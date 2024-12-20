import { db } from "@/lib/db/index";
import { CreateOrderDTO, GetOrdersParams, OrderComplete, UpdateOrderDTO } from "@/types";
import { OrderStatus } from "@prisma/client";
import { ProductRepository } from ".";


export async function findAllByCompanyIdPaginated(companyId: string, params: GetOrdersParams, timezone: string) {
  const { page, per_page, status, forToday, keyword, isConfirmed } = params;
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
      ...(isConfirmed !== undefined && { isConfirmed: isConfirmed }),
      deletedAt: null,
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
      client: {
        select: {
          name: true,
          address: true,
          city: true,
          phone: true,
        }
      }
    },
  });
}

export async function getOrdersFromDate(startDate: Date, endDate: Date, companyId: string) {
  return db.order.findMany({
    where: {
      companyId,
      deliveredAt: { gte: startDate, lt: endDate }
    },
    include: {
      products: {
        include: {
          product: {
            include: {
              costComponents: {
                include: {
                  costComponent: true
                }
              }
            }
          }
        }
      },
    }
  });
}

export async function findById(id: number, companyId: string): Promise<OrderComplete | null> {
  return db.order.findUnique({
    where: { id, companyId },
    include: {
      products: {
        include: {
          product: true
        }
      },
    }
  }) as unknown as OrderComplete | null;
}

export async function ordersCountByCompanyId(companyId: string, params: GetOrdersParams) {
  const { status, forToday, keyword, isConfirmed } = params;
  return db.order.count({
    where: {
      ...(status !== "ALL" && { status: OrderStatus[status as OrderStatus] }),
      ...(forToday && { toDeliverAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)), lte: new Date(new Date().setHours(23, 59, 59, 999)) } }),
      ...(keyword && { client: { name: { contains: keyword, mode: 'insensitive' } } }),
      ...(isConfirmed !== undefined && { isConfirmed: isConfirmed }),
      companyId,
      deletedAt: null,
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

export async function create(createOrderDto: CreateOrderDTO, companyId: string, userId: string) {
  return db.$transaction(async (tx) => {
    const productsExist = await tx.product.findMany({
      where: {
        id: { in: createOrderDto.products.map(p => p.productId) },
        companyId,
        deletedAt: null
      }
    })

    if (productsExist.length !== createOrderDto.products.length) {
      throw new Error('Some products do not exist or are deleted')
    }

    let orderTotal = 0
    const orderProductsData = await Promise.all(
      createOrderDto.products.map(async (product) => {
        const finalPrice = await ProductRepository.getPrice(
          product.productId,
          createOrderDto.clientId,
          tx
        )

        orderTotal += finalPrice * product.quantity

        return {
          productId: product.productId,
          quantity: product.quantity,
          price: finalPrice
        }
      })
    )

    const order = await tx.order.create({
      data: {
        clientId: createOrderDto.clientId,
        userId,
        companyId,
        toDeliverAt: createOrderDto.toDeliverAt ? new Date(createOrderDto.toDeliverAt).toISOString() : new Date().toISOString(),
        status: createOrderDto.status ?? OrderStatus.PENDING,
        ...(createOrderDto.deliveredAt && {
          deliveredAt: new Date(createOrderDto.deliveredAt).toISOString()
        }),
        total: orderTotal,
        products: {
          create: orderProductsData
        },
        ...(createOrderDto.isConfirmed && { isConfirmed: createOrderDto.isConfirmed }),
        ...(createOrderDto.status === OrderStatus.DELIVERED && { deliveredAt: new Date().toISOString() }),
      },
      include: {
        products: {
          include: {
            product: true
          }
        },
        client: true
      }
    })

    return order
  })
}

export async function update(id: number, updateOrderDto: UpdateOrderDTO, companyId: string) {
  return db.$transaction(async (tx) => {
    const productsExist = await tx.product.findMany({
      where: {
        id: { in: updateOrderDto.products?.map(p => p.productId) || [] },
        companyId,
        deletedAt: null
      }
    });

    if (updateOrderDto.products && productsExist.length !== updateOrderDto.products.length) {
      throw new Error('Some products do not exist or are deleted');
    }

    let orderTotal = 0;
    let orderProductsData;
    if (updateOrderDto.products) {
      orderProductsData = await Promise.all(
        updateOrderDto.products.map(async (product) => {
          const finalPrice = await ProductRepository.getPrice(
            product.productId,
            updateOrderDto.clientId,
            tx
          );

          orderTotal += finalPrice * product.quantity;

          return {
            productId: product.productId,
            quantity: product.quantity,
            price: finalPrice
          };
        })
      );
    }

    return tx.order.update({
      where: { id, companyId },
      data: {
        ...(updateOrderDto.clientId && { clientId: updateOrderDto.clientId }),
        ...(updateOrderDto.toDeliverAt && {
          toDeliverAt: new Date(updateOrderDto.toDeliverAt).toISOString()
        }),
        ...(updateOrderDto.status && { status: updateOrderDto.status }),
        ...(updateOrderDto.deliveredAt && {
          deliveredAt: new Date(updateOrderDto.deliveredAt).toISOString()
        }),
        ...(orderTotal > 0 && { total: orderTotal }),
        ...(orderProductsData && {
          products: {
            deleteMany: {},
            create: orderProductsData
          }
        }),
        ...(updateOrderDto.isConfirmed && { isConfirmed: updateOrderDto.isConfirmed }),
        ...(updateOrderDto.status === OrderStatus.DELIVERED ? { deliveredAt: new Date().toISOString() } : { deliveredAt: null }),
      },
      include: {
        products: {
          include: {
            product: true
          }
        },
        client: true
      }
    });
  });
}

export async function markAsDelivered(orderIds: number[]) {
  return db.order.updateMany({
    where: { id: { in: orderIds } },
    data: { status: OrderStatus.DELIVERED, deliveredAt: new Date().toISOString() }
  });
}

export async function getMonthlyTotalIncome(startDate: Date, endDate: Date, companyId: string) {
  const result = await db.$queryRaw<[{ total: bigint | null }]>`
    SELECT SUM(p.price * op.quantity) as total
    FROM "Order" o
    JOIN "OrderProduct" op ON o.id = op."orderId"
    JOIN "Product" p ON op."productId" = p.id
    WHERE o."deliveredAt" >= ${startDate} AND o."deliveredAt" < ${endDate}
    AND o."companyId" = ${companyId}
  `;
  return result[0]?.total ? Number(result[0].total) : 0;
}

export async function getMonthlyCount(startDate: Date, endDate: Date, companyId: string) {
  return db.order.count({
    where: {
      deliveredAt: {
        gte: startDate,
        lt: endDate
      },
      companyId
    }
  })
}

export async function getMonthlyActiveClients(startDate: Date, endDate: Date, companyId: string) {
  return db.order.groupBy({
    by: ['clientId'],
    where: {
      deliveredAt: {
        gte: startDate,
        lt: endDate
      },
      companyId
    }
  })
}

export async function getOrderStatuses(companyId: string) {
  return db.order.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
    where: {
      companyId,
    },
  });
}

