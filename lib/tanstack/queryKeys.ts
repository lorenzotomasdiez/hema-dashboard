import { GetOrdersParams } from "@/types";

export const QUERY_KEYS = {
    dashboard: {
        summary: ["dashboard-summary"] as const,
    },
    clients: {
        root: ["clients"] as const,
        full: ["clients", "full"] as const,
    },
    orders: {
        root: ["orders"] as const,
        paginated: (state: GetOrdersParams = { page: 0, per_page: 10, status: "ALL", forToday: false }) => ["orders", { state }] as const,
    },
    products: {
        root: ["products"] as const,
        bySlug: (slug: string) => ["products", slug] as const,
    },
    costComponent: {
        root: ["cost-component"] as const,
    },
    expenses: {
        root: ["expenses"] as const,
    }
} as const;
