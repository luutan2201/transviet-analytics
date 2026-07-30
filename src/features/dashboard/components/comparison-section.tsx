"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import { METRIC_ICONS } from "@/features/dashboard/config/metric-icons";
import { calculateMetricSetGrowth } from "@/features/dashboard/utils/growth";
import type { MetricSet } from "@/features/dashboard/types/dashboard.model";
import type { KpiMetric } from "@/config/kpi";
import { formatCompactNumber, formatSignedPercent } from "@/utils/formatters";

interface ComparisonSectionProps {
  readonly current: MetricSet;
  readonly previous: MetricSet;
  readonly periodLabel: string;
  /** Overrides which 4 metrics highlight — defaults to reach/impressions/followers/reactions. */
  readonly metrics?: readonly KpiMetric[];
}

const DEFAULT_HIGHLIGHTED_METRICS = ["reach", "impressions", "followers", "reactions"] as const;

export function ComparisonSection({
  current,
  previous,
  periodLabel,
  metrics,
}: ComparisonSectionProps) {
  const growth = calculateMetricSetGrowth(current, previous);
  const highlighted = metrics ?? DEFAULT_HIGHLIGHTED_METRICS;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[var(--foreground)]">So sánh {periodLabel}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {highlighted.map((metric, index) => {
          const g = growth[metric];
          const Icon = METRIC_ICONS[metric];
          const TrendIcon =
            g.trend === "up" ? ArrowUpRight : g.trend === "down" ? ArrowDownRight : Minus;
          const trendColor =
            g.trend === "up"
              ? "var(--color-success)"
              : g.trend === "down"
                ? "var(--color-danger)"
                : "var(--muted-foreground)";

          return (
            <motion.div
              key={metric}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <GlassCard className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                  <Icon className="size-4" />
                  {METRIC_LABELS[metric]}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-[var(--foreground)]">
                    {formatCompactNumber(g.current)}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    vs {formatCompactNumber(g.previous)}
                  </span>
                </div>
                <div
                  className="flex items-center gap-1 text-sm font-medium"
                  style={{ color: trendColor }}
                >
                  <TrendIcon className="size-4" />
                  {formatSignedPercent(g.growthPercent)}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
