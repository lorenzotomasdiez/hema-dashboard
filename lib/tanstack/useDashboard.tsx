import { DashboardSummaryData } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "./queryKeys"
import { getDashboardSummary } from "@/services/dashboard"

export const useDashboardQuery = () => {
  return useQuery<DashboardSummaryData>({
    queryKey: QUERY_KEYS.dashboard.summary,
    queryFn: getDashboardSummary,
    staleTime: 1000 * 60
  })
}