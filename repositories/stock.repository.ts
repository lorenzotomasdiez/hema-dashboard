import { db } from "@/lib/db";
import { CreateStockMovementProps } from "@/types/stock";

export async function findProductAndStock(productId: number, companyId: string) {
  const product = await db.product.findUnique({
    where: { id: productId, companyId },
    include: {
      stockMovements: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
  return product;
}

export async function createStockMovement(props: CreateStockMovementProps) {
  return db.stockMovement.create({
    data: {productId: props.productId, companyId: props.companyId, quantity: props.movementValue, movementType: props.movementType, description: props.description, userId: props.userId}
  })
}

export async function updateStockProduct(productId: number, companyId: string, newStockValue: number) {
  return db.product.update({
    where: {id: productId, companyId},
    data: {stock: newStockValue}
  })
}