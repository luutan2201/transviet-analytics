import type { DashboardApiResponse } from "@/features/dashboard/types/dashboard-api.schema";
import type { DashboardModel, WeeklyMetricPoint } from "@/features/dashboard/types/dashboard.model";
import {
  aggregateToMonthly,
  aggregateToQuarterly,
  aggregateToYearly,
} from "@/features/dashboard/utils/aggregate";

/**
 * Transforms the raw API response into the immutable DashboardModel consumed by the UI.
 * Monthly/quarterly/yearly aggregates are computed here from weekly data — per
 * 05_GG_Sheet_Data_Structure.md ("Never calculate business logic inside Google Sheets" /
 * "the website is responsible for Monthly/Quarter/Year calculations"), the API is only
 * expected to supply raw weekly rows even though its `data` envelope reserves fields for
 * pre-aggregated arrays.
 */
export function transformDashboardResponse(response: DashboardApiResponse): DashboardModel {
  const weekly: readonly WeeklyMetricPoint[] = response.data.weekly.map((row) => ({ ...row }));

  const monthly =
    response.data.monthly.length > 0
      ? response.data.monthly.map((row) => ({ ...row }))
      : aggregateToMonthly(weekly);

  const quarterly =
    response.data.quarterly.length > 0
      ? response.data.quarterly.map((row) => ({ ...row }))
      : aggregateToQuarterly(weekly);

  const yearly =
    response.data.yearly.length > 0
      ? response.data.yearly.map((row) => ({ ...row }))
      : aggregateToYearly(weekly);

  return {
    weekly,
    monthly,
    quarterly,
    yearly,
    lastSync: response.updatedAt,
    platform: "facebook",
  };
}
