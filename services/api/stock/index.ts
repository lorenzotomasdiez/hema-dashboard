import { StockRepository } from "@/repositories";
import { StockMovementType } from "@prisma/client";

export default class APIStockService {
  static async findProductAndStock(productId: number, companyId: string) {
    return StockRepository.findProductAndStock(productId, companyId);
  }

  static async updateStockProduct(productId: number, companyId: string, newStockValue: number) {
    return StockRepository.updateStockProduct(productId, companyId, newStockValue);
  }

  static async adjustStockProduct(productId: number, companyId: string, newStockValue: number) {
    const product = await this.findProductAndStock(productId, companyId);
    if(!product) throw new Error("Product not found");
    const currentStockNumber = product.stock;
    const movementValue = newStockValue - currentStockNumber;
    await this.createStockMovement(productId, companyId, movementValue, StockMovementType.ADJUSTMENT);
    const updatedProduct = await this.updateStockProduct(productId, companyId, newStockValue);
    return updatedProduct;
  }

  static async createStockMovement(productId: number, companyId: string, movementValue: number, movementType: StockMovementType) {
    return StockRepository.createStockMovement(productId, companyId, movementValue, movementType);
  }
}