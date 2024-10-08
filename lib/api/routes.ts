export const API_ROUTES = {
  orders: {
    root: "/api/orders",
    id: (id: number) => `/api/orders/${id}`
  },
  clients: {
    root: "/api/clients",
    full: "/api/clients/full",
    id: (id: string) => `/api/clients/${id}`
  },
  products: {
    root: "/api/products",
    id: (id: number) => `/api/products/${id}`
  },
  dashboard: {
    summary: "/api/dashboard/summary"
  }
}

export const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/ /g, "-");
}