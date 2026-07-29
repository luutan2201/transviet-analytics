import { SUPPORTED_KPI_METRICS, type KpiMetric } from "@/config/kpi";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import type { MetricSet } from "@/features/dashboard/types/dashboard.model";
import type { KpiTargetRaw } from "@/features/kpi/types/kpi-api.schema";
import type { KpiModel } from "@/features/kpi/types/kpi.model";
import { calculateGrowth } from "@/features/dashboard/utils/growth";
import {
  calculateCompletion,
  calculateRemaining,
  calculateStatus,
} from "@/features/kpi/utils/kpi-calculation";
import { calculateForecast, calculateForecastStatus } from "@/features/kpi/utils/kpi-forecast";
import { generateKpiRecommendation } from "@/features/kpi/utils/kpi-recommendation";

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "");
}

/** Builds a lookup from normalized metric label/key → canonical KpiMetric. */
const METRIC_LOOKUP: ReadonlyMap<string, KpiMetric> = new Map(
  SUPPORTED_KPI_METRICS.flatMap((metric) => [
    [normalize(metric), metric],
    [normalize(METRIC_LABELS[metric]), metric],
  ])
);

export interface PeriodContext {
  readonly periodType: "week" | "month" | "quarter" | "year";
  readonly year: number;
  readonly month: number | null;
  readonly quarter: number | null;
}

function findTargetForMetric(
  metric: KpiMetric,
  targets: readonly KpiTargetRaw[],
  period: PeriodContext
): KpiTargetRaw | undefined {
  return targets.find((t) => {
    if (METRIC_LOOKUP.get(normalize(t.metric)) !== metric || !t.enabled) return false;
    if (t.year !== period.year) return false;

    // A target configured for a specific month/quarter only applies when the
    // dashboard is viewing that exact period — otherwise it would silently
    // leak into unrelated months (e.g. an August target showing up in July).
    if (t.periodType === "month") return t.month === period.month;
    if (t.periodType === "quarter") return t.quarter === period.quarter;
    return true; // year-level target applies to any period within that year
  });
}

export function transformKpiData(
  current: MetricSet,
  previous: MetricSet,
  targets: readonly KpiTargetRaw[],
  period: PeriodContext
): KpiModel[] {
  return SUPPORTED_KPI_METRICS.map((metric) => {
    const currentValue = current[metric];
    const previousValue = previous[metric];
    const growth = calculateGrowth(currentValue, previousValue);
    const targetConfig = findTargetForMetric(metric, targets, period);

    if (!targetConfig || targetConfig.target === 0) {
      return {
        metric,
        current: currentValue,
        previous: previousValue,
        target: null,
        completion: null,
        remaining: null,
        forecast: null,
        forecastStatus: null,
        status: "notConfigured",
        trend: growth.trend,
        recommendation: "Chưa cấu hình mục tiêu KPI cho chỉ số này.",
      };
    }

    const completion = calculateCompletion(currentValue, targetConfig.target);
    const remaining = calculateRemaining(currentValue, targetConfig.target);
    const status = calculateStatus(completion);
    const forecast = calculateForecast(
      currentValue,
      targetConfig.periodType,
      targetConfig.year,
      targetConfig.month ?? null,
      targetConfig.quarter ?? null
    );
    const forecastStatus = calculateForecastStatus(forecast, targetConfig.target);
    const recommendation = generateKpiRecommendation(metric, status);

    return {
      metric,
      current: currentValue,
      previous: previousValue,
      target: targetConfig.target,
      completion,
      remaining,
      forecast,
      forecastStatus,
      status,
      trend: growth.trend,
      recommendation,
    };
  });
}
