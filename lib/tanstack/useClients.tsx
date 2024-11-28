import { ClientsPaginatedResponse, ClientWithOrdersTotal, CreateClientType, GetClientsParams } from "@/types"
import { QueryClient, QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "./queryKeys"
import { createClient, getClientsFull, getClientsPaginated, updateClient } from "@/services/clients"
import { toast } from "sonner"
import { Client } from "@prisma/client"
import { useState } from "react"

export const useClientsQuery = () => {
  return useQuery<ClientWithOrdersTotal[]>({
    queryKey: QUERY_KEYS.clients.full,
    queryFn: getClientsFull,
    staleTime: 1000 * 60
  })
}

export const useClientsPaginatedQuery = (initialParams: GetClientsParams) => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<GetClientsParams>(initialParams);

  const clientsQuery = useQuery<ClientsPaginatedResponse>({
    queryKey: QUERY_KEYS.clients.paginated(params),
    queryFn: () => getClientsPaginated(params),
    staleTime: 1000 * 60
  })

  const prefetchNextPage = () => {
    const hasNextPage = clientsQuery?.data?.clients.length ?? 0 < params.per_page;
    if (!hasNextPage) return;
    const nextPageParams = {
      ...params,
      page: params.page + 1
    }
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.clients.paginated(nextPageParams),
      queryFn: () => getClientsPaginated(nextPageParams),
      staleTime: 1000 * 60
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
      queryKey: QUERY_KEYS.clients.paginated(prevPageParams),
      queryFn: () => getClientsPaginated(prevPageParams),
      staleTime: 1000 * 60
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

  return {
    clientsQuery,
    handlePrevPage,
    handleNextPage,
    page: params.page,
    per_page: params.per_page,
    keyword: params.keyword,
    prefetchNextPage,
    prefetchPrevPage,
    handleKeyword
  }
}

export const AddClientMutation = (queryKey: QueryKey, queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["addClient"],
    mutationFn: (clientData: CreateClientType) => createClient(clientData),
    onMutate: async (clientData: CreateClientType) => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previousClients = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey,
        (old: CreateClientType[]) => [
          { ...clientData, ordersTotal: 0, id: new Date().getTime().toString() },
          ...old
        ]
      );
      return { previousClients }
    },
    onSuccess: () => {
      toast.success("Cliente creado correctamente!");
    },
    onError: (err, _client, context) => {
      queryClient.setQueryData(queryKey, context?.previousClients)
      toast.error("Error al agregar el cliente", {
        description: err.message
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.full });
    }
  })
}


export const UpdateClientMutation = (queryKey: QueryKey, queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["updateClient"],
    mutationFn: (clientData: CreateClientType & { id: string }) => updateClient(clientData.id, {
      ...clientData,
    }),
    onMutate: async (clientData: CreateClientType & { id: string }) => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previousClients = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Client[]) => old.map(o => o.id === clientData.id ? clientData : o));
      return { previousClients }
    },
    onSuccess: () => {
      toast.success("Cliente actualizado correctamente!");
    },
    onError: (err, _client, context) => {
      queryClient.setQueryData(queryKey, context?.previousClients)
      toast.error("Error al actualizar el cliente", {
        description: err.message
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.full });
    }
  })
}