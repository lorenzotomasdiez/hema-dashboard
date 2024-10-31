export const APP_PATH = {
  public: {
    landing: "/",
    signin: "/api/auth/signin",
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
    orders: "/orders",
    organization: "/organization",
    products: {
      root: "/products",
      add: "/products/add",
      update: (slug: string) => `/products/${slug}`
    },
    costs: {
      root: "/costs"
    },
    settings: "/settings"
  }
}