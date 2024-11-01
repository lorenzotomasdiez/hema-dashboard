import { generateSlug } from "@/lib/api/routes";
import { db } from "@/lib/db";
import { CreateProductType, ProductWithCostComponents } from "@/types";

export async function findAllByCompanyId(companyId: string) {
  return db.product.findMany({
    where: { companyId },
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
    where: { companyId_slug: { companyId, slug } },
    include: {
      costComponents: {
        include: {
          costComponent: true
        }
      }
    }
  });
}

export async function create(product: CreateProductType, companyId: string) {
  const { name, description, price, slug, stock, costComponents } = product;
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
      }
    }
  });
}

export async function updateById(id: number, product: Partial<ProductWithCostComponents>, companyId: string) {
  const { id: _, costComponents, ...updatedData } = product;
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
      }
    },
    include: {
      costComponents: true
    }
  });
}

export async function deleteById(id: number, companyId: string) {
  await db.orderProduct.deleteMany({
    where: { productId: id, order: { companyId } }
  });
  return db.product.delete({
    where: { id, companyId },
    include: {
      costComponents: true,
      productions: true,
      stockMovements: true
    }
  });
}
