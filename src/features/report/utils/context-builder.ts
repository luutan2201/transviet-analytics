import { FACEBOOK_METRICS, type KpiMetric } from "@/config/kpi";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import type { MetricSet } from "@/features/dashboard/types/dashboard.model";
import { calculateGrowth } from "@/features/dashboard/utils/growth";
import type { KpiModel } from "@/features/kpi/types/kpi.model";
import { generateInsights } from "@/features/insights/utils/insight-engine";
import { KPI_STATUS_LABELS } from "@/features/kpi/config/kpi-status-labels";
import type { ReportContext, ReportType } from "@/features/report/types/report.types";

export function buildReportContext(
  reportType: ReportType,
  periodLabel: string,
  year: number,
  current: MetricSet,
  previous: MetricSet,
  kpis: readonly KpiModel[],
  platformLabel: string = "Facebook",
  metrics: readonly KpiMetric[] = FACEBOOK_METRICS
): ReportContext {
  const metricSummaries = metrics.map((metric) => {
    const growth = calculateGrowth(current[metric], previous[metric]);
    return {
      metric: METRIC_LABELS[metric],
      current: growth.current,
      previous: growth.previous,
      growthPercent: growth.growthPercent,
    };
  });

  const kpiSummaries = kpis.map((kpi) => ({
    metric: METRIC_LABELS[kpi.metric],
    target: kpi.target,
    completion: kpi.completion,
    status: KPI_STATUS_LABELS[kpi.status],
  }));

  const insights = generateInsights(current, previous, metrics);
  const topPositiveInsights = insights
    .filter((i) => i.severity === "positive")
    .map((i) => i.description);
  const topNegativeInsights = insights
    .filter((i) => i.severity === "negative" || i.severity === "warning")
    .map((i) => i.description);

  return {
    reportType,
    periodLabel,
    year,
    platformLabel,
    metrics: metricSummaries,
    kpis: kpiSummaries,
    topPositiveInsights,
    topNegativeInsights,
    language: "vi",
  };
}
