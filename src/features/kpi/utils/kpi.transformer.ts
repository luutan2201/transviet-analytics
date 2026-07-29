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

function findTargetForMetric(
  metric: KpiMetric,
  targets: readonly KpiTargetRaw[]
): KpiTargetRaw | undefined {
  return targets.find((t) => METRIC_LOOKUP.get(normalize(t.metric)) === metric && t.enabled);
}

export function transformKpiData(
  current: MetricSet,
  previous: MetricSet,
  targets: readonly KpiTargetRaw[]
): KpiModel[] {
  return SUPPORTED_KPI_METRICS.map((metric) => {
    const currentValue = current[metric];
    const previousValue = previous[metric];
    const growth = calculateGrowth(currentValue, previousValue);
    const targetConfig = findTargetForMetric(metric, targets);

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
