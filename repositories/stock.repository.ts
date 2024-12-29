import { db } from "@/lib/db";
import { StockMovementType } from "@prisma/client";

export async function findProductAndStock(productId: number, companyId: string) {
  const product = await db.product.findUnique({
    where: { id: productId, companyId },
    include: {
      stockMovements: true
    }
  });
  return product;
}

export async function createStockMovement(productId: number, companyId: string, movementValue: number, movementType: StockMovementType) {
  return db.stockMovement.create({
    data: {productId, companyId, quantity: movementValue, movementType}
  })
}

export async function updateStockProduct(productId: number, companyId: string, newStockValue: number) {
  return db.product.update({
    where: {id: productId, companyId},
    data: {stock: newStockValue}
  })
}