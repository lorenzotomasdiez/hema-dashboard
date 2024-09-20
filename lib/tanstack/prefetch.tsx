import { getClients, getClientsFull } from "@/services/clients";
import { QUERY_KEYS } from "./queryKeys";
import { getDashboardSummary } from "@/services/dashboard";
import { getProducts } from "@/services/products";
import { getOrders } from "@/services/orders";

export const prefetchDashboardSummaryData = {
    queryKey: QUERY_KEYS.dashboard.summary,
    queryFn: getDashboardSummary,
    staleTime: 999 * 60
};

export const prefetchClientsFullData = {
    queryKey: QUERY_KEYS.clients.full,
    queryFn: getClientsFull,
    staleTime: 999 * 60
}

export const prefetchClientsData = {
    queryKey: QUERY_KEYS.clients.root,
    queryFn: getClients,
    staleTime: 999 * 60
}

export const prefetchProductsData = {
    queryKey: QUERY_KEYS.products.root,
    queryFn: getProducts,
    staleTime: 999 * 60
}

export const prefetchOrdersData = {
    queryKey: QUERY_KEYS.orders.paginated(),
    queryFn: getOrders,
    staleTime: 999 * 60
}