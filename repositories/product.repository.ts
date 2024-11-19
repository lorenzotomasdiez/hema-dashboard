import { generateSlug } from "@/lib/api/routes";
import { db } from "@/lib/db";
import { CreateProductType, ProductComplete, ProductWithCostComponents } from "@/types";
import { Prisma } from "@prisma/client";

export async function findAllByCompanyId(companyId: string) {
  return db.product.findMany({
    where: { companyId, deletedAt: null },
    orderBy: [
      {
        slug: "desc"
      }
    ]
  });
}

export async function findById(id: number, companyId: string) {
  return db.product.findUnique({
    where: { id, companyId },
    include: {
      costComponents: true
    }
  });
}

export async function findBySlug(slug: string, companyId: string) {
  return db.product.findUnique({
    where: { companyId_slug: { companyId, slug }, deletedAt: null },
    include: {
      costComponents: {
        include: {
          costComponent: true
        }
      }
    }
  });
}

export async function findCompleteBySlug(slug: string, companyId: string) {
  return db.product.findUnique({
    where: { companyId_slug: { companyId, slug }, deletedAt: null },
    include: {
      costComponents: {
        include: {
          costComponent: {
            select: {
              name: true,
              id: true,
              cost: true
            }
          }
        }
      },
      clientPrices: {
        select: {
          clientId: true,
          price: true
        }
      }
    }
  });
}

export async function create(product: CreateProductType, companyId: string) {
  const { name, description, price, slug, stock, costComponents, clientPrices } = product;
  return db.product.create({
    data: {
      name,
      description,
      price,
      slug: slug || generateSlug(name),
      stock,
      companyId,
      costComponents: {
        create: costComponents?.map(component => ({
          costComponentId: component.id
        }))
      },
      clientPrices: {
        create: clientPrices?.map(({ clientId, price }) => ({
          clientId,
          price
        }))
      }
    },
    include: {
      costComponents: {
        include: {
          costComponent: true
        }
      },
      clientPrices: true
    }
  });
}

export async function updateById(id: number, product: Partial<ProductComplete>, companyId: string) {
  const { id: _, costComponents, clientPrices, stock, ...updatedData } = product;
  return db.product.update({
    where: { id: product.id, companyId },
    data: {
      ...updatedData,
      costComponents: {
        deleteMany: {
          productId: id
        },
        create: costComponents?.map((cost) => ({
          costComponentId: cost.id
        })) || []
      },
      clientPrices: {
        deleteMany: {
          productId: id
        },
        create: clientPrices?.map(({ clientId, price }) => ({
          clientId,
          price
        })) || []
      }
    },
    include: {
      costComponents: {
        include: {
          costComponent: true
        }
      },
      clientPrices: true
    }
  });
}

export async function deleteById(id: number, companyId: string) {
  return db.product.update({
    where: { id, companyId },
    data: { deletedAt: new Date() }
  });
}

export async function updateStock(id: number, stock: number, companyId: string) {
  return db.product.update({
    where: { id, companyId },
    data: { stock }
  });
}

export async function getPrice(id: number, clientId: string, tx?: Prisma.TransactionClient) {
  const dbContext = tx || db;
  const clientProduct = await dbContext.clientProduct.findUnique({
    where: { 
      clientId_productId: { clientId, productId: id },
      deletedAt: null
    }
  })

  if (clientProduct) return clientProduct.price;

  const normalProduct = await dbContext.product.findUnique({
    where: { 
      id,
      deletedAt: null
    }
  })

  if (!normalProduct) throw new Error('Product not found');

  return normalProduct.price;
}