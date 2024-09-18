import { API_ROUTES } from "@/lib/api/routes";

export async function getDashboardSummary() {
    const res = await fetch(API_ROUTES.dashboard.summary);
    const data = await res.json();
    return data;
}