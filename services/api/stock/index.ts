import { OrderRepository, StockRepository } from "@/repositories";
import { CreateStockMovementProps } from "@/types/stock";
import { OrderStatus, StockMovementType } from "@prisma/client";

export default class APIStockService {
  static async findProductAndStock(productId: number, companyId: string) {
    return StockRepository.findProductAndStock(productId, companyId);
  }

  static async updateStockProduct(productId: number, companyId: string, newStockValue: number) {
    return StockRepository.updateStockProduct(productId, companyId, newStockValue);
  }

  static async adjustStockProduct(productId: number, companyId: string, newStockValue: number, description: string, userId: string) {
    const product = await this.findProductAndStock(productId, companyId);
    if(!product) throw new Error("Product not found");
    const currentStockNumber = product.stock;
    const movementValue = newStockValue - currentStockNumber;
    await this.createStockMovement({
      productId,
      companyId,
      movementValue,
      movementType: StockMovementType.ADJUSTMENT,
      description,
      userId: userId,
      finalStock: newStockValue
    });
    const updatedProduct = await this.updateStockProduct(productId, companyId, newStockValue);
    return updatedProduct;
  }

  static async createStockMovement(props: CreateStockMovementProps) {
    return StockRepository.createStockMovement(props);
  }

  static async addStockProduct(productId: number, companyId: string, newStockValue: number, description: string, userId: string) {
    const product = await this.findProductAndStock(productId, companyId);
    if(!product) throw new Error("Product not found");
    const currentStockNumber = product.stock;
    await this.createStockMovement({
      productId,
      companyId,
      movementValue: newStockValue,
      movementType: StockMovementType.PRODUCTION,
      description,
      userId: userId,
      finalStock: currentStockNumber + newStockValue
    });
    const updatedProduct = await this.updateStockProduct(productId, companyId, currentStockNumber + newStockValue);
    return updatedProduct;
  }

  static async removeStockProduct(productId: number, companyId: string, numberToRemove: number, description: string, userId: string) {
    const product = await this.findProductAndStock(productId, companyId);
    if(!product) throw new Error("Product not found");
    const currentStockNumber = product.stock;
    await this.createStockMovement({
      productId,
      companyId,
      movementValue: -numberToRemove,
      movementType: StockMovementType.PRODUCTION,
      description,
      userId: userId,
      finalStock: currentStockNumber - numberToRemove
    });
    const updatedProduct = await this.updateStockProduct(productId, companyId, currentStockNumber - numberToRemove);
    return updatedProduct;
  }
}