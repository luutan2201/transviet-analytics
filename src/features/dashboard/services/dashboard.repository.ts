import type { Result } from "@/types/result";
import type { DashboardApiResponse } from "@/features/dashboard/types/dashboard-api.schema";

export interface DashboardQueryParams {
  readonly year: number;
  readonly force?: boolean;
}

/**
 * Contract for fetching raw dashboard data from any source.
 * Epic 06 will add GoogleSheetDashboardRepository implementing this same interface —
 * no component, hook, or service above this layer should need to change.
 */
export interface DashboardRepository {
  getDashboard(params: DashboardQueryParams): Promise<Result<DashboardApiResponse>>;
}
