export const KPI_STATUSES = ["critical", "warning", "good", "excellent", "outstanding"] as const;
export type KpiStatus = (typeof KPI_STATUSES)[number];

/**
 * Completion percentage thresholds mapped to status.
 * Configurable per 07_KPI_engine.md — administrators may override in Settings (Epic 09).
 */
export const KPI_STATUS_THRESHOLDS: Readonly<Record<KpiStatus, { min: number; max: number }>> = {
  critical: { min: 0, max: 49.99 },
  warning: { min: 50, max: 74.99 },
  good: { min: 75, max: 99.99 },
  excellent: { min: 100, max: 120 },
  outstanding: { min: 120.01, max: Infinity },
};

export const SUPPORTED_KPI_METRICS = [
  "reach",
  "impressions",
  "followers",
  "reactions",
  "comments",
  "shares",
  "clicks",
  "videoViews",
] as const;
export type KpiMetric = (typeof SUPPORTED_KPI_METRICS)[number];
