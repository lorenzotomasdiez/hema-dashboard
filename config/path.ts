export const APP_PATH = {
  public: {
    landing: "/",
    signin: "/signin",
    signout: "/api/auth/signout"
  },
  protected: {
    account: "/account",
    chooseCompany: "/choose-company",
    clients: "/clients",
    dashboard: {
      root: "/dashboard"
    },
    notAllowed: "/not-allowed",
    orders: {
      root: "/orders",
      add: "/orders/create",
      details: (id: number) => `/orders/${id}`,
      confirmed: "/orders/confirmed"
    },
    organization: "/organization",
    products: {
      root: "/products",
      add: "/products/add",
      update: (slug: string) => `/products/${slug}`
    },
    costs: {
      root: "/costs"
    },
    settings: "/settings",
    stock: {
      root: "/stock",
      details: (id: number) => `/stock/${id}`
    }
  }
}
