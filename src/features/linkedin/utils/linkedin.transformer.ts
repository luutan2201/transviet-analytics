import type { DashboardApiResponse } from "@/features/dashboard/types/dashboard-api.schema";
import type { DashboardModel } from "@/features/dashboard/types/dashboard.model";
import { aggregateToQuarterly, aggregateToYearly } from "@/features/dashboard/utils/aggregate";

/**
 * Transforms the LinkedIn API response into a DashboardModel. LinkedIn only
 * provides monthly granularity (per product decision — no weekly breakdown
 * needed), so `weekly` is populated with the same monthly points: every
 * existing hook/component that filters by month/quarter/year works unchanged
 * without needing LinkedIn-specific period-selection logic.
 */
export function transformLinkedInResponse(response: DashboardApiResponse): DashboardModel {
  const monthly = response.data.monthly.map((row) => ({ ...row }));

  return {
    weekly: monthly,
    monthly,
    quarterly: aggregateToQuarterly(monthly),
    yearly: aggregateToYearly(monthly),
    lastSync: response.updatedAt,
    platform: "linkedin",
  };
}
