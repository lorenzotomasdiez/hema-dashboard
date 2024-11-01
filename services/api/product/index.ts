import { CreateProductType, ProductWithCostComponents } from "@/types";
import { ProductRepository } from "@/repositories";

export default class ProductService {
  static async create(product: CreateProductType, companyId: string) {
    return ProductRepository.create(product, companyId);
  }

  static async updateById(id: number, product: Partial<ProductWithCostComponents>, companyId: string) {
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
}
