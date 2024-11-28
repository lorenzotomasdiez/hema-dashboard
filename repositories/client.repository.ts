import { db } from "@/lib/db";
import { GetClientsParams } from "@/types";

export default class ClientRepository {
  static async deleteClient(id: string, companyId: string) {
    return await db.client.delete({
      where: { id, companyId },
      include: {
        orders: {
          include: {
            products: true
          }
        },
        productPrices: true
      }
    });
  }

  static async getAll(companyId: string, params?: GetClientsParams) {
    if(params){
      const count = await db.client.count({
        where: {
          companyId,
          name: {
            contains: params.keyword,
            mode: "insensitive"
          }
        },
      })
      const {keyword, page, per_page} = params;
      const clients = await db.client.findMany({
        where: {
          companyId,
          name: {
            contains: keyword,
            mode: "insensitive"
          }
        },
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
          email: true,
          city: true,
          createdAt: true,
          companyId: true,
          _count: {
            select: {
              orders: true
            }
          }
        },
        skip: page * (per_page),
        take: per_page,
        orderBy: {
          orders: {
            _count: "desc"
          }
        }
      })
      return {
        clients,
        total: count
      };
    }

    const count = await db.client.count({
      where: {
        companyId,
      },
    })

    const clients = await db.client.findMany({
      where: {
        companyId
      },
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        email: true,
        city: true,
        createdAt: true,
        companyId: true,
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: {
        orders: {
          _count: "desc"
        }
      }
    });

    return {
      clients,
      total: count
    };
  }
}