export type InsightSeverity = "positive" | "negative" | "neutral" | "warning";
export type InsightPriority = "critical" | "high" | "medium" | "low";

export interface Insight {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly severity: InsightSeverity;
  readonly priority: InsightPriority;
  readonly recommendation: string;
  readonly confidence: number;
  readonly timestamp: string;
}
