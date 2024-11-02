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
    status: (id: number) => `/api/orders/status/${id}`
  },
  clients: {
    root: "/api/clients",
    full: "/api/clients/full",
    id: (id: string) => `/api/clients/${id}`
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
  }
}

export const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/ /g, "-");
}