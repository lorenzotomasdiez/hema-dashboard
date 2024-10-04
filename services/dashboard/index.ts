import { API_ROUTES } from "@/lib/api/routes";
import { responseHandler } from "../request";

export async function getDashboardSummary() {
    const res = await fetch(API_ROUTES.dashboard.summary);
    return await responseHandler(res);
}