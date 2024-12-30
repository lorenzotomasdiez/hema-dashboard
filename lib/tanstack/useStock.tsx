import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { addStockProduct, adjustStockProduct, getStockProduct } from "@/services/stock";
import { ProductWithStock } from "@/types/stock";
import { toast } from "sonner";

interface Props {
  productId: number;
}

export const useStockProduct = ({
  productId
}: Props) => {
  return useQuery<ProductWithStock>({
    queryKey: QUERY_KEYS.stock.product(productId),
    queryFn: () => getStockProduct(productId),
    staleTime: 999 * 60
  })
}


interface AdjustStockProps {
  productId: number;
  stock: number;
  description: string;
}

interface AdjustStockMutationProps {
  queryClient: QueryClient;
}

export const AdjustStockMutation = ({queryClient}: AdjustStockMutationProps) => {
  return useMutation({
    mutationFn: (props: AdjustStockProps) => adjustStockProduct(props.productId, props.stock, props.description),
    mutationKey: ["adjustStock"],
    onSuccess: (_data, _variables, context) => {
      toast.success("Stock actualizado correctamente!")
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.stock.product(_variables.productId)})
    },
    onError: (err, _props, context) => {
      toast.error("Error al actualizar el stock", {
        description: err.message
      })
    }
  })
}

interface AddStockProps {
  productId: number;
  stock: number;
  description: string;
}

export const AddStockMutation = ({queryClient}: AdjustStockMutationProps) => {
  return useMutation({
    mutationFn: (props: AddStockProps) => addStockProduct(props.productId, props.stock, props.description),
    mutationKey: ["addStock"],
    onSuccess: (_data, _variables) => {
      toast.success("Stock actualizado correctamente!")
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.stock.product(_variables.productId)})
    },
    onError: (err, _props, context) => {
      toast.error("Error al actualizar el stock", {
        description: err.message
      })
    }
  })
}