import { ClientWithOrdersTotal, CreateClientType } from "@/types"
import { QueryClient, QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "./queryKeys"
import { createClient, getClientsFull, updateClient } from "@/services/clients"
import { toast } from "sonner"
import { Client } from "@prisma/client"

export const useClientsQuery = () => {
  return useQuery<ClientWithOrdersTotal[]>({
    queryKey: QUERY_KEYS.clients.full,
    queryFn: getClientsFull,
    staleTime: 1000 * 60
  })
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
      toast.error("Error al agregar el cliente");
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
    onMutate: async (clientData: Client) => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previousClients = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Client[]) => old.map(o => o.id === clientData.id ? clientData : o));
      return { previousClients }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success("Cliente actualizado correctamente!");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Error al actualizar el cliente");
    }
  })
}