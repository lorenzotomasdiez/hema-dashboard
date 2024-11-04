import { db } from "@/lib/db/index";
import { CreateOrderDTO, GetOrdersParams, OrderComplete, UpdateOrderDTO } from "@/types";
import { OrderStatus } from "@prisma/client";
import { ProductRepository } from ".";


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
    },
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
  const { status, forToday, keyword } = params;
  return db.order.count({
    where: {
      ...(status !== "ALL" && { status: OrderStatus[status as OrderStatus] }),
      ...(forToday && { toDeliverAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)), lte: new Date(new Date().setHours(23, 59, 59, 999)) } }),
      ...(keyword && { client: { name: { contains: keyword, mode: 'insensitive' } } }),
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
        }
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
    // Verify products exist
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

    // Calculate new order total if products are being updated
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

    // Update the order
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
            deleteMany: {},  // Remove existing products
            create: orderProductsData  // Add new products
          }
        })
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