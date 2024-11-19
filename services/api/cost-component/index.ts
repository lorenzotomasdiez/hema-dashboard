import { CostComponentRepository } from "@/repositories";
import { CreateCostComponentType } from "@/types/cost-component";

export default class APICostComponentService {
  static async findAllByCompanyId(companyId: string) {
    const costComponents = await CostComponentRepository.findCostComponentByCompanyId(companyId);
    return costComponents;
  }
  
  static async create(costComponent: CreateCostComponentType) {
    const newCostComponent = await CostComponentRepository.createCostComponent(costComponent);
    return newCostComponent;
  }

  static async deleteCostComponent(costComponentId: number) {
    const deletedCostComponent = await CostComponentRepository.deleteCostComponent(costComponentId);
    return deletedCostComponent;
  }

  static async disableCostComponent(costComponentId: number) {
    const disabledCostComponent = await CostComponentRepository.disableCostComponent(costComponentId);
    return disabledCostComponent;
  }
}
