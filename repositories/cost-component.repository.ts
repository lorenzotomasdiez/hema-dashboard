import { db } from "@/lib/db";
import { CreateCostComponentType } from "@/types/cost-component";

export async function findCostComponentByCompanyId(companyId: string, targetDate?: string) {
  const costComponents = await db.costComponent.findMany({
    where: {
      companyId,
      deletedAt: null,
      ...(targetDate ? {
        OR: [
          { disabledFrom: null },
          { disabledFrom: { gt: targetDate } }
        ]
      } : {
        disabledFrom: null
      })
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

export async function deleteCostComponent(costComponentId: number) {
  await db.productCostComponent.deleteMany({
    where: { costComponentId }
  });

  const deletedCostComponent = await db.costComponent.update({
    where: { id: costComponentId },
    data: { deletedAt: new Date() }
  });
  return deletedCostComponent;
}

export async function disableCostComponent(costComponentId: number) {
  const disabledCostComponent = await db.costComponent.update({
    where: { id: costComponentId },
    data: { disabledFrom: new Date() }
  });
  return disabledCostComponent;
}

