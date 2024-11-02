import { toast } from "sonner"
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "./queryKeys"
import { getCostComponents, createCostComponent, deleteCostComponent, disableCostComponent } from "@/services/cost-component"
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

export const DeleteCostComponentMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["deleteCostComponent"],
    mutationFn: (costComponentId: number) => deleteCostComponent(costComponentId),
    onMutate: async (costComponentId: number) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.costComponent.root });
      const previousCostComponents = queryClient.getQueryData<CostComponent[]>(QUERY_KEYS.costComponent.root);
      queryClient.setQueryData(QUERY_KEYS.costComponent.root, previousCostComponents?.filter(costComponent => costComponent.id !== costComponentId));
      return { previousCostComponents };
    },
    onSuccess: () => {
      toast.success("Costo eliminado correctamente!")
    },
    onError: (err, _client, context) => {
      queryClient.setQueryData(QUERY_KEYS.costComponent.root, context?.previousCostComponents)
      toast.error("Error al eliminar el costo", {
        description: err.message
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.costComponent.root });
    }
  })
}

export const DisableCostComponentMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["disableCostComponent"],
    mutationFn: (costComponentId: number) => disableCostComponent(costComponentId),
    onMutate: async (costComponentId: number) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.costComponent.root });
      const previousCostComponents = queryClient.getQueryData<CostComponent[]>(QUERY_KEYS.costComponent.root);
      queryClient.setQueryData(QUERY_KEYS.costComponent.root, previousCostComponents?.filter(costComponent => costComponent.id !== costComponentId));
      return { previousCostComponents };
    },
    onSuccess: () => {
      toast.success("Costo deshabilitado correctamente!")
    },
    onError: (err, _client, context) => {
      queryClient.setQueryData(QUERY_KEYS.costComponent.root, context?.previousCostComponents)
      toast.error("Error al deshabilitar el costo", {
        description: err.message
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.costComponent.root });
    }
  })
}