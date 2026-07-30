import type { KpiMetric } from "@/config/kpi";

export interface MetricSet {
  readonly reach: number;
  readonly impressions: number;
  readonly followers: number;
  readonly reactions: number;
  readonly comments: number;
  readonly shares: number;
  readonly clicks: number;
  readonly videoViews: number;
}

export const EMPTY_METRIC_SET: MetricSet = {
  reach: 0,
  impressions: 0,
  followers: 0,
  reactions: 0,
  comments: 0,
  shares: 0,
  clicks: 0,
  videoViews: 0,
};

export interface WeeklyMetricPoint extends MetricSet {
  readonly week: string;
  readonly month: number;
  readonly quarter: number;
  readonly year: number;
}

export interface DashboardModel {
  readonly weekly: readonly WeeklyMetricPoint[];
  readonly monthly: readonly WeeklyMetricPoint[];
  readonly quarterly: readonly WeeklyMetricPoint[];
  readonly yearly: readonly WeeklyMetricPoint[];
  readonly lastSync: string;
  readonly platform: "facebook" | "linkedin";
}

export const METRIC_LABELS: Readonly<Record<KpiMetric, string>> = {
  reach: "Reach",
  impressions: "Impressions",
  followers: "Followers",
  reactions: "Reactions",
  comments: "Comments",
  shares: "Shares",
  clicks: "Clicks",
  videoViews: "Video Views",
};
