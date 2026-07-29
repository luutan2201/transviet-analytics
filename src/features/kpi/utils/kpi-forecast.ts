import type { ForecastStatus } from "@/features/kpi/types/kpi.model";

interface PeriodBounds {
  readonly start: Date;
  readonly end: Date;
}

function getMonthBounds(year: number, month: number): PeriodBounds {
  return { start: new Date(year, month - 1, 1), end: new Date(year, month, 0) };
}

function getQuarterBounds(year: number, quarter: number): PeriodBounds {
  const startMonth = (quarter - 1) * 3;
  return { start: new Date(year, startMonth, 1), end: new Date(year, startMonth + 3, 0) };
}

function getYearBounds(year: number): PeriodBounds {
  return { start: new Date(year, 0, 1), end: new Date(year, 11, 31) };
}

function daysBetween(a: Date, b: Date): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.max(Math.round((b.getTime() - a.getTime()) / MS_PER_DAY), 0);
}

/**
 * Projects end-of-period performance using a simple linear model:
 * forecast = averageDailyProgress × remainingDays + current.
 * Current version uses simple projection — per spec, ML/regression is a future upgrade.
 */
export function calculateForecast(
  current: number,
  periodType: "month" | "quarter" | "year",
  year: number,
  month: number | null,
  quarter: number | null,
  today: Date = new Date()
): number {
  const bounds =
    periodType === "month" && month
      ? getMonthBounds(year, month)
      : periodType === "quarter" && quarter
        ? getQuarterBounds(year, quarter)
        : getYearBounds(year);

  const totalDays = daysBetween(bounds.start, bounds.end) + 1;
  const elapsedDays = Math.min(Math.max(daysBetween(bounds.start, today) + 1, 1), totalDays);
  const remainingDays = totalDays - elapsedDays;

  const averageDailyProgress = current / elapsedDays;
  return Math.round(averageDailyProgress * remainingDays + current);
}

/** Classifies forecast (as % of target) into a risk bucket, per FORECAST STATUS spec. */
export function calculateForecastStatus(forecast: number, target: number): ForecastStatus {
  if (target === 0) return "achievable";
  const forecastPercent = (forecast / target) * 100;

  if (forecastPercent > 100) return "achievable";
  if (forecastPercent >= 90) return "needsAttention";
  if (forecastPercent >= 75) return "highRisk";
  return "critical";
}
