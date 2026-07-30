export type ReportType = "weekly" | "monthly" | "quarterly" | "yearly";

export interface ReportMetricSummary {
  readonly metric: string;
  readonly current: number;
  readonly previous: number;
  readonly growthPercent: number;
}

export interface ReportKpiSummary {
  readonly metric: string;
  readonly target: number | null;
  readonly completion: number | null;
  readonly status: string;
}

/** Business context assembled from Dashboard + KPI + Insight Engines — never raw sheet rows. */
export interface ReportContext {
  readonly reportType: ReportType;
  readonly periodLabel: string;
  readonly year: number;
  readonly platformLabel: string;
  readonly metrics: readonly ReportMetricSummary[];
  readonly kpis: readonly ReportKpiSummary[];
  readonly topPositiveInsights: readonly string[];
  readonly topNegativeInsights: readonly string[];
  readonly language: "vi";
}

export interface GeneratedReport {
  readonly id: string;
  readonly reportType: ReportType;
  readonly periodLabel: string;
  readonly markdown: string;
  readonly provider: string;
  readonly generatedAt: string;
}

export const REPORT_REQUIRED_SECTIONS = [
  "Tóm tắt điều hành",
  "Tổng quan hiệu suất",
  "Phân tích KPI",
  "Phân tích tăng trưởng",
  "Điểm tích cực",
  "Điểm cần lưu ý",
  "Khuyến nghị",
  "Kết luận",
] as const;

/** Approximate target word counts per 06_Report_engine.md REPORT LENGTH. */
export const REPORT_LENGTH_RANGE: Readonly<Record<ReportType, { min: number; max: number }>> = {
  weekly: { min: 500, max: 700 },
  monthly: { min: 700, max: 1200 },
  quarterly: { min: 1000, max: 1500 },
  yearly: { min: 1500, max: 2500 },
};
