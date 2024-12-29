import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { adjustStockProduct, getStockProduct } from "@/services/stock";
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
}

interface AdjustStockMutationProps {
  queryClient: QueryClient;
}

export const AdjustStockMutation = ({queryClient}: AdjustStockMutationProps) => {
  return useMutation({
    mutationFn: (props: AdjustStockProps) => adjustStockProduct(props.productId, props.stock),
    mutationKey: ["adjustStock"],
    onMutate: async (props: AdjustStockProps) => {
      queryClient.invalidateQueries({queryKey: QUERY_KEYS.stock.product(props.productId)})
    },
    onSuccess: () => {
      toast.success("Stock actualizado correctamente!")
    },
    onError: (err, _props, context) => {
      toast.error("Error al actualizar el stock", {
        description: err.message
      })
    }
  })
}