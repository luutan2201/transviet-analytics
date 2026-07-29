import { SUPPORTED_KPI_METRICS } from "@/config/kpi";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import type { MetricSet } from "@/features/dashboard/types/dashboard.model";
import { calculateMetricSetGrowth } from "@/features/dashboard/utils/growth";
import type { Insight, InsightPriority } from "@/features/insights/types/insight.types";

const PRIORITY_WEIGHT: Record<InsightPriority, number> = {
  critical: 3,
  high: 2,
  medium: 1,
  low: 0,
};
const MAX_INSIGHTS = 5;

function growthPriority(absGrowth: number): InsightPriority {
  if (absGrowth >= 30) return "critical";
  if (absGrowth >= 15) return "high";
  if (absGrowth >= 5) return "medium";
  return "low";
}

/**
 * Generates insights from growth data using deterministic rules — no LLM required.
 * Epic 08 (AI Report) may layer AI-expanded narrative on top of these same insights.
 */
export function generateInsights(current: MetricSet, previous: MetricSet): Insight[] {
  const growth = calculateMetricSetGrowth(current, previous);
  const now = new Date().toISOString();
  const insights: Insight[] = [];

  for (const metric of SUPPORTED_KPI_METRICS) {
    const g = growth[metric];
    const label = METRIC_LABELS[metric];
    const absGrowth = Math.abs(g.growthPercent);

    if (g.trend === "up" && absGrowth >= 5) {
      insights.push({
        id: `growth-${metric}`,
        title: `${label} tăng trưởng tích cực`,
        description: `${label} tăng ${g.growthPercent.toFixed(1)}% so với kỳ trước, đạt ${g.current.toLocaleString("vi-VN")}.`,
        severity: "positive",
        priority: growthPriority(absGrowth),
        recommendation: `Duy trì chiến lược hiện tại cho ${label.toLowerCase()} và nhân rộng nội dung hiệu quả.`,
        confidence: Math.min(0.6 + absGrowth / 100, 0.95),
        timestamp: now,
      });
    }

    if (g.trend === "down" && absGrowth >= 5) {
      insights.push({
        id: `decline-${metric}`,
        title: `${label} có dấu hiệu suy giảm`,
        description: `${label} giảm ${absGrowth.toFixed(1)}% so với kỳ trước, còn ${g.current.toLocaleString("vi-VN")}.`,
        severity: absGrowth >= 15 ? "warning" : "negative",
        priority: growthPriority(absGrowth),
        recommendation: `Xem xét lại chiến lược nội dung và tần suất đăng bài liên quan đến ${label.toLowerCase()}.`,
        confidence: Math.min(0.6 + absGrowth / 100, 0.95),
        timestamp: now,
      });
    }
  }

  return insights
    .sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority])
    .slice(0, MAX_INSIGHTS);
}
