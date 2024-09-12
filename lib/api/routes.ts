export const API_ROUTES = {
  orders: {
    root: "/api/orders",
    id: (id: number) => `/api/orders/${id}`
  },
  clients: {
    root: "/api/clients"
  }
}