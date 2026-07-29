import type { MetricSet } from "@/features/dashboard/types/dashboard.model";

export type TrendDirection = "up" | "down" | "stable";

export interface MetricGrowth {
  readonly current: number;
  readonly previous: number;
  readonly difference: number;
  readonly growthPercent: number;
  readonly trend: TrendDirection;
}

export function calculateGrowth(current: number, previous: number): MetricGrowth {
  const difference = current - previous;
  const growthPercent = previous === 0 ? (current === 0 ? 0 : 100) : (difference / previous) * 100;
  const trend: TrendDirection = difference > 0 ? "up" : difference < 0 ? "down" : "stable";

  return { current, previous, difference, growthPercent, trend };
}

export function calculateMetricSetGrowth(
  current: MetricSet,
  previous: MetricSet
): Readonly<Record<keyof MetricSet, MetricGrowth>> {
  const keys = Object.keys(current) as (keyof MetricSet)[];
  return keys.reduce(
    (acc, key) => {
      acc[key] = calculateGrowth(current[key], previous[key]);
      return acc;
    },
    {} as Record<keyof MetricSet, MetricGrowth>
  );
}
