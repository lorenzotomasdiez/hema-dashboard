import { CreateProductType, ProductComplete } from "@/types";
import { ProductRepository } from "@/repositories";

export default class APIProductService {
  static async create(product: CreateProductType, companyId: string) {
    return ProductRepository.create(product, companyId);
  }

  static async updateById(id: number, product: Partial<ProductComplete>, companyId: string) {
    return ProductRepository.updateById(id, product, companyId);
  }

  static async deleteById(id: number, companyId: string) {
    return ProductRepository.deleteById(id, companyId);
  }

  static async findById(id: number, companyId: string) {
    return ProductRepository.findById(id, companyId);
  }

  static async findAllByCompanyId(companyId: string) {
    return ProductRepository.findAllByCompanyId(companyId);
  }

  static async findBySlug(slug: string, companyId: string) {
    return ProductRepository.findBySlug(slug, companyId);
  }

  static async updateStock(id: number, stock: number, companyId: string) {
    return ProductRepository.updateStock(id, stock, companyId);
  }

  static async findCompleteBySlug(slug: string, companyId: string) {
    return ProductRepository.findCompleteBySlug(slug, companyId);
  }
}
