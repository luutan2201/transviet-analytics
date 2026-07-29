import type {
  DashboardModel,
  MetricSet,
  WeeklyMetricPoint,
} from "@/features/dashboard/types/dashboard.model";
import type { FilterPeriod } from "@/stores/filter.store";
import { aggregateMetrics } from "@/features/dashboard/utils/aggregate";
import { EMPTY_METRIC_SET } from "@/features/dashboard/types/dashboard.model";

export interface PeriodSelection {
  readonly year: number;
  readonly period: FilterPeriod;
  readonly month: number | null;
  readonly quarter: number | null;
  readonly week: string | null;
}

interface PeriodMetrics {
  readonly current: MetricSet;
  readonly previous: MetricSet;
  /** Weekly points within the current selection — used to render trend charts. */
  readonly points: readonly WeeklyMetricPoint[];
}

function filterWeekly(
  weekly: readonly WeeklyMetricPoint[],
  selection: PeriodSelection
): readonly WeeklyMetricPoint[] {
  return weekly.filter((point) => {
    if (point.year !== selection.year) return false;
    if (selection.period === "week") return point.week === selection.week;
    if (selection.period === "month") return point.month === selection.month;
    if (selection.period === "quarter") return point.quarter === selection.quarter;
    return true; // year
  });
}

function shiftToPreviousPeriod(selection: PeriodSelection): PeriodSelection {
  switch (selection.period) {
    case "month": {
      const isJanuary = selection.month === 1;
      return {
        ...selection,
        year: isJanuary ? selection.year - 1 : selection.year,
        month: isJanuary ? 12 : (selection.month ?? 1) - 1,
      };
    }
    case "quarter": {
      const isQ1 = selection.quarter === 1;
      return {
        ...selection,
        year: isQ1 ? selection.year - 1 : selection.year,
        quarter: isQ1 ? 4 : (selection.quarter ?? 1) - 1,
      };
    }
    case "year":
      return { ...selection, year: selection.year - 1 };
    case "week":
      // Week-over-week comparison is out of scope for v1 (no ISO week arithmetic yet).
      return selection;
    default:
      return selection;
  }
}

/**
 * Resolves current + previous MetricSet for the active filter, plus the raw weekly
 * points backing the current selection (used by chart components).
 */
export function selectPeriodMetrics(
  model: DashboardModel,
  selection: PeriodSelection
): PeriodMetrics {
  const currentPoints = filterWeekly(model.weekly, selection);
  const previousSelection = shiftToPreviousPeriod(selection);
  const previousPoints = filterWeekly(model.weekly, previousSelection);

  return {
    current: currentPoints.length > 0 ? aggregateMetrics(currentPoints) : EMPTY_METRIC_SET,
    previous: previousPoints.length > 0 ? aggregateMetrics(previousPoints) : EMPTY_METRIC_SET,
    points: currentPoints,
  };
}
