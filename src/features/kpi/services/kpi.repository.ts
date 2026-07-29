import type { Result } from "@/types/result";
import type { KpiApiResponse } from "@/features/kpi/types/kpi-api.schema";

export interface KpiQueryParams {
  readonly year: number;
}

export interface KpiRepository {
  getKpiTargets(params: KpiQueryParams): Promise<Result<KpiApiResponse>>;
}
