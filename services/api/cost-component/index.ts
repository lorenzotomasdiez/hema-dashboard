import { createCostComponent, findCostComponentByCompanyId } from "@/repositories";
import { CreateCostComponentType } from "@/types/cost-component";

export default class APICostComponentService {
  static async findAllByCompanyId(companyId: string) {
    const costComponents = await findCostComponentByCompanyId(companyId);
    return costComponents;
  }
  static async create(costComponent: CreateCostComponentType) {
    const newCostComponent = await createCostComponent(costComponent);
    return newCostComponent;
  }
}
