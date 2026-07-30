import type { MetricSet, WeeklyMetricPoint } from "@/features/dashboard/types/dashboard.model";
import { EMPTY_METRIC_SET } from "@/features/dashboard/types/dashboard.model";

const SUMMED_KEYS = [
  "reach",
  "impressions",
  "newFollowers",
  "reactions",
  "comments",
  "shares",
  "clicks",
  "videoViews",
] as const;

/**
 * Aggregates a set of weekly points into a single MetricSet.
 * Followers is cumulative — use the LAST value, never sum (per data structure spec).
 * All other metrics are summed.
 */
export function aggregateMetrics(points: readonly WeeklyMetricPoint[]): MetricSet {
  if (points.length === 0) return EMPTY_METRIC_SET;

  const summed = points.reduce<MetricSet>(
    (acc, point) => {
      const next = { ...acc };
      for (const key of SUMMED_KEYS) {
        (next[key] as number) = acc[key] + point[key];
      }
      return next;
    },
    { ...EMPTY_METRIC_SET }
  );

  const lastPoint = points[points.length - 1];

  return { ...summed, followers: lastPoint?.followers ?? 0 };
}

interface GroupedPeriod {
  readonly key: string;
  readonly year: number;
  readonly month: number;
  readonly quarter: number;
  readonly points: readonly WeeklyMetricPoint[];
}

function groupBy(
  points: readonly WeeklyMetricPoint[],
  keyFn: (point: WeeklyMetricPoint) => string
): readonly GroupedPeriod[] {
  const groups = new Map<string, WeeklyMetricPoint[]>();
  for (const point of points) {
    const key = keyFn(point);
    const existing = groups.get(key);
    if (existing) {
      existing.push(point);
    } else {
      groups.set(key, [point]);
    }
  }
  return Array.from(groups.entries()).map(([key, groupPoints]) => ({
    key,
    year: groupPoints[0]!.year,
    month: groupPoints[0]!.month,
    quarter: groupPoints[0]!.quarter,
    points: groupPoints,
  }));
}

/** Aggregates weekly points into one WeeklyMetricPoint-shaped record per month. */
export function aggregateToMonthly(weekly: readonly WeeklyMetricPoint[]): WeeklyMetricPoint[] {
  const groups = groupBy(weekly, (p) => `${p.year}-${p.month}`);
  return groups.map((group) => ({
    week: `M${String(group.month).padStart(2, "0")}`,
    month: group.month,
    quarter: group.quarter,
    year: group.year,
    ...aggregateMetrics(group.points),
  }));
}

/** Aggregates weekly points into one WeeklyMetricPoint-shaped record per quarter. */
export function aggregateToQuarterly(weekly: readonly WeeklyMetricPoint[]): WeeklyMetricPoint[] {
  const groups = groupBy(weekly, (p) => `${p.year}-Q${p.quarter}`);
  return groups.map((group) => ({
    week: `Q${group.quarter}`,
    month: group.points[group.points.length - 1]!.month,
    quarter: group.quarter,
    year: group.year,
    ...aggregateMetrics(group.points),
  }));
}

/** Aggregates weekly points into one WeeklyMetricPoint-shaped record per year. */
export function aggregateToYearly(weekly: readonly WeeklyMetricPoint[]): WeeklyMetricPoint[] {
  const groups = groupBy(weekly, (p) => `${p.year}`);
  return groups.map((group) => ({
    week: `${group.year}`,
    month: 12,
    quarter: 4,
    year: group.year,
    ...aggregateMetrics(group.points),
  }));
}
