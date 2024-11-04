import { toast } from "sonner"
import { useEffect, useState } from "react"
import { OrderStatus } from "@prisma/client"
import { changeOrderStatus, createOrder, getOrders, updateOrder } from "@/services/orders"
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CreateOrderDTO, GetOrdersParams, GetOrdersResponse, UpdateOrderDTO, UpdateOrderStatusProps } from "@/types"
import { QUERY_KEYS } from "./queryKeys"

interface Props {
  initialParams: GetOrdersParams
}

export const useOrders = ({ initialParams }: Props) => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<GetOrdersParams>(initialParams);

  const ordersQuery = useQuery<GetOrdersResponse>({
    queryKey: QUERY_KEYS.orders.paginated(params),
    queryFn: () => getOrders(params),
    staleTime: 999 * 60,
  })

  const prefetchNextPage = () => {
    const hasNextPage = ordersQuery?.data?.orders.length ?? 0 < params.per_page;
    if (!hasNextPage) return;
    const nextPageParams = {
      ...params,
      page: params.page + 1
    }
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.orders.paginated(nextPageParams),
      queryFn: () => getOrders(nextPageParams),
      staleTime: 999 * 60
    })
  }

  const prefetchPrevPage = () => {
    const hasPrevPage = params.page > 0;
    if (!hasPrevPage) return;
    const prevPageParams = {
      ...params,
      page: params.page - 1
    }
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.orders.paginated(prevPageParams),
      queryFn: () => getOrders(prevPageParams),
      staleTime: 999 * 60
    })
  }

  const handlePrevPage = () => {
    const newPage = params.page - 1 <= 0 ? 0 : params.page - 1;
    setParams(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const handleNextPage = () => {
    const hasNextPage = ordersQuery?.data?.orders.length ?? 0 < params.per_page;
    if (!hasNextPage) return;
    const newPage = params.page + 1;
    setParams(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const handleKeyword = (keyword: string) => {
    setParams(prev => ({
      ...prev,
      keyword
    }))
  }

  const handleStatus = (status: OrderStatus | "ALL") => {
    setParams(prev => ({
      ...prev,
      status,
      page: 0
    }))
  }

  const handleForToday = (forToday: boolean) => {
    setParams(prev => ({
      ...prev,
      forToday,
      page: 0
    }))
  }

  useEffect(() => {
    ordersQuery.refetch()
  }, [params])

  return {
    ordersQuery,
    handlePrevPage,
    handleNextPage,
    page: params.page,
    per_page: params.per_page,
    status: params.status,
    keyword: params.keyword,
    forToday: params.forToday,
    queryKey: QUERY_KEYS.orders.paginated(params),
    handleKeyword,
    handleStatus,
    prefetchNextPage,
    prefetchPrevPage,
    handleForToday
  };
}

export const UpdateOrderStatusMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: ({ id, status }: UpdateOrderStatusProps) => changeOrderStatus(id, status),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.orders.root });
    },
    onSuccess: () => {
      toast.success("Estado de la orden actualizado correctamente!")
    },
    onError: (err, _client, context) => {
      toast.error("Error al actualizar el estado de la orden", {
        description: err.message
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.root });
    }
  })
}


export const AddOrderMutation = (queryClient: QueryClient) => {
  return useMutation({
  mutationKey: ["addOrder"],
  mutationFn: (orderData: CreateOrderDTO) => createOrder(orderData),
  onMutate: async (orderData: CreateOrderDTO) => {
    console.log(orderData);
    await queryClient.cancelQueries({ queryKey: QUERY_KEYS.orders.root });
    const previousOrders = queryClient.getQueryData(QUERY_KEYS.orders.root);
    queryClient.setQueryData(
      QUERY_KEYS.orders.root,
      (old: GetOrdersResponse) => {
        if (!old) return;
        return {
          ...old,
          orders: [
            {
              ...orderData,
              createdAt: new Date().toISOString(),
              id: new Date().getTime(),
            },
            ...old.orders
          ],
          total: old.ordersCount + 1
        }
      }
    );
    return { previousOrders }
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.root });
    toast.success("Pedido creado correctamente!");
  },
  onError: (_err, _order, context) => {
    console.log(_err);
    queryClient.setQueryData(QUERY_KEYS.orders.root, context?.previousOrders)
    toast.error("Error al crear el pedido");
  },
  onSettled: (_data, error) => {
    if (error) {
      console.log(error);
    }
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.summary });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.root });
  }
})
}

export const UpdateOrderMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["updateOrder"],
    mutationFn: (orderData: UpdateOrderDTO) => updateOrder(orderData.id, orderData),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.orders.root });
    },
    onSuccess: () => {
      toast.success("Pedido actualizado correctamente!");
    },
    onError: (_err) => {
      toast.error("Error al actualizar el pedido", {
        description: _err.message
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.root });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.summary });
    }
  })
}