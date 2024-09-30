import { useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "./queryKeys"
import { GetOrdersParams, GetOrdersResponse, Order } from "@/types"
import { getOrders } from "@/services/orders"
import { OrderStatus } from "@prisma/client"
import { useEffect, useState } from "react"

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