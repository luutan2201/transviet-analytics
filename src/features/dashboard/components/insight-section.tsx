"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Sparkles, Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { generateInsights } from "@/features/insights/utils/insight-engine";
import type { MetricSet } from "@/features/dashboard/types/dashboard.model";
import type { KpiMetric } from "@/config/kpi";
import type { InsightSeverity } from "@/features/insights/types/insight.types";

interface InsightSectionProps {
  readonly current: MetricSet;
  readonly previous: MetricSet;
  readonly metrics?: readonly KpiMetric[];
}

const SEVERITY_BADGE: Record<InsightSeverity, "success" | "danger" | "warning" | "neutral"> = {
  positive: "success",
  negative: "danger",
  warning: "warning",
  neutral: "neutral",
};

export function InsightSection({ current, previous, metrics }: InsightSectionProps) {
  const insights = metrics
    ? generateInsights(current, previous, metrics)
    : generateInsights(current, previous);

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="size-5 text-[var(--primary)]" />
        <h3 className="text-base font-semibold text-[var(--foreground)]">Insights</h3>
      </div>

      {insights.length === 0 ? (
        <EmptyState
          title="Chưa có insight nổi bật"
          description="Hiệu suất ổn định, không có biến động đáng chú ý trong kỳ này."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <GlassCard className="flex flex-col gap-2.5 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {insight.severity === "positive" ? (
                      <TrendingUp className="size-4 text-[var(--color-success)]" />
                    ) : (
                      <TrendingDown className="size-4 text-[var(--color-danger)]" />
                    )}
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {insight.title}
                    </p>
                  </div>
                  <Badge variant={SEVERITY_BADGE[insight.severity]}>
                    {Math.round(insight.confidence * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">{insight.description}</p>
                <p className="flex items-start gap-1.5 text-xs italic text-[var(--muted-foreground)]">
                  <Lightbulb className="mt-0.5 size-3.5 shrink-0" />
                  {insight.recommendation}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
