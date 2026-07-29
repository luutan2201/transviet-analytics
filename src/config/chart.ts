export const CHART_TYPES = [
  "line",
  "area",
  "bar",
  "horizontalBar",
  "radar",
  "donut",
  "heatmap",
  "comparison",
  "stackedBar",
  "sparkline",
] as const;
export type ChartType = (typeof CHART_TYPES)[number];

/** Default visual configuration shared by every chart component. */
export const CHART_DEFAULTS = {
  animationDurationMs: 500,
  gridOpacity: 0.1,
  tooltipRadius: 12,
  legendGap: 16,
} as const;
