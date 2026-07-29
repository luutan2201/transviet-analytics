import type { KpiMetric, KpiStatus } from "@/config/kpi";
import type { TrendDirection } from "@/features/dashboard/utils/growth";

export interface KpiTarget {
  readonly metric: KpiMetric;
  readonly target: number;
  readonly periodType: "month" | "quarter" | "year";
  readonly month: number | null;
  readonly quarter: number | null;
  readonly year: number;
  readonly enabled: boolean;
}

export type ForecastStatus = "achievable" | "needsAttention" | "highRisk" | "critical";

export interface KpiModel {
  readonly metric: KpiMetric;
  readonly current: number;
  readonly previous: number;
  readonly target: number | null;
  readonly completion: number | null;
  readonly remaining: number | null;
  readonly forecast: number | null;
  readonly forecastStatus: ForecastStatus | null;
  readonly status: KpiStatus | "notConfigured";
  readonly trend: TrendDirection;
  readonly recommendation: string;
}
