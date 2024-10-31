import { toast } from "sonner"
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "./queryKeys"
import { getCostComponents, createCostComponent } from "@/services/cost-component"
import { CreateCostComponentType } from "@/types/cost-component"
import { CostComponent } from "@prisma/client"

export const useCostComponentsQuery = () => {
  return useQuery<CostComponent[]>({
    queryKey: QUERY_KEYS.costComponent.root,
    queryFn: getCostComponents,
    staleTime: 1000 * 60
  })
}

export const AddCostComponentMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["addCostComponent"],
    mutationFn: (costComponent: CreateCostComponentType) => createCostComponent(costComponent),
    onMutate: async (costComponent: CreateCostComponentType) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.costComponent.root });
      const previousCostComponents = queryClient.getQueryData<CostComponent[]>(QUERY_KEYS.costComponent.root);
      queryClient.setQueryData(QUERY_KEYS.costComponent.root, [costComponent, ...(previousCostComponents || [])]);
      return { previousCostComponents };
    },
    onSuccess: () => {
      toast.success("Costo creado correctamente!")
    },
    onError: (err, _client, context) => {
      queryClient.setQueryData(QUERY_KEYS.costComponent.root, context?.previousCostComponents)
      toast.error("Error al crear el costo", {
        description: err.message
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.costComponent.root });
    }
  })
}