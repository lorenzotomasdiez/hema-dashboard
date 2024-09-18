export const API_ROUTES = {
  orders: {
    root: "/api/orders",
    id: (id: number) => `/api/orders/${id}`
  },
  clients: {
    root: "/api/clients",
    full: "/api/clients/full",
    id: (id: number) => `/api/clients/${id}`
  },
  products: {
    root: "/api/products"
  },
  dashboard: {
    summary: "/api/dashboard/summary"
  }
}

export const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/ /g, "-");
}