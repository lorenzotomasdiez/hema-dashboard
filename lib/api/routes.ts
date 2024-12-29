import { GetClientsParams } from "@/types";

export const API_ROUTES = {
  companies: {
    root: "/api/companies",
    create: "/api/companies/create",
    info: "/api/companies/info",
  },
  expenses:{
    root: "/api/expenses"
  },
  orders: {
    root: "/api/orders",
    id: (id: number) => `/api/orders/${id}`,
    status: (id: number) => `/api/orders/status/${id}`,
    markAsDelivered: "/api/orders/mark-as-delivered"
  },
  clients: {
    root: "/api/clients",
    full: "/api/clients/full",
    id: (id: string) => `/api/clients/${id}`,
    delete: (id: string) => `/api/clients/${id}`,
    paginated: (params: GetClientsParams) => `/api/clients/paginated?${Object.entries(params).map(([key, value]) => `${key}=${value}`).join("&")}`
  },
  products: {
    root: "/api/products",
    id: (id: number) => `/api/products/${id}`,
    slug: (slug: string) => `/api/products/slug/${slug}`,
  },
  dashboard: {
    summary: "/api/dashboard/summary"
  },
  costComponent: {
    root: "/api/cost-component"
  },
  invitations: {
    root: "/api/invitations",
    inviteUser: "/api/invitations/invite-user",
    acceptInvitation: (invitationId: string) => `/api/invitations/accept/${invitationId}` 
  },
  stock: {
    root: "/api/stock",
    product: (productId: number) => `/api/stock/${productId}`,
    adjust: (productId: number) => `/api/stock/${productId}/adjust`
  }
}

export const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/ /g, "-");
}