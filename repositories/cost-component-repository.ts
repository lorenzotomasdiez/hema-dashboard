import { db } from "@/lib/db";
import { CreateCostComponentType } from "@/types/cost-component";

export async function findCostComponentByCompanyId(companyId: string) {
  const costComponents = await db.costComponent.findMany({
    where: {
      companyId
    },
  });
  return costComponents;
}

export async function createCostComponent(costComponent: CreateCostComponentType) {
  const newCostComponent = await db.costComponent.create({
    data: {
      ...costComponent,
    }
  });
  return newCostComponent;
}

