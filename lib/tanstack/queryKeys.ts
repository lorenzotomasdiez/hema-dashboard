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
        paginated: (state: GetOrdersParams = { page: 0, per_page: 10, status: "ALL", forToday: false }) => ["orders", { state }] as const,
    },
    products: {
        root: ["products"] as const,
    }
} as const;