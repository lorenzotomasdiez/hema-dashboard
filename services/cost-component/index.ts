import { API_ROUTES } from "@/lib/api/routes";
import { CreateCostComponentType } from "@/types/cost-component";
import { responseHandler } from "../request";

export async function getCostComponents() {
  const res = await fetch(API_ROUTES.costComponent.root);
  return await responseHandler(res);
}

export async function createCostComponent(costComponent: CreateCostComponentType) {
  const res = await fetch(API_ROUTES.costComponent.root, {
    method: "POST",
    body: JSON.stringify(costComponent)
  });
  return await responseHandler(res);
}
