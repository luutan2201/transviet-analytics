"use client";

import { motion } from "framer-motion";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import { SUPPORTED_KPI_METRICS } from "@/config/kpi";
import { calculateMetricSetGrowth } from "@/features/dashboard/utils/growth";
import type { MetricSet, WeeklyMetricPoint } from "@/features/dashboard/types/dashboard.model";

interface KpiGridProps {
  readonly current: MetricSet;
  readonly previous: MetricSet;
  readonly points: readonly WeeklyMetricPoint[];
  readonly onSelectMetric?: (metric: (typeof SUPPORTED_KPI_METRICS)[number]) => void;
}

/** Priority order per Dashboard_Engine.md KPI PRIORITY — reach/impressions/followers first. */
const DISPLAY_ORDER = [
  "reach",
  "impressions",
  "followers",
  "reactions",
  "shares",
  "comments",
  "clicks",
  "videoViews",
] as const;

export function KpiGrid({ current, previous, points, onSelectMetric }: KpiGridProps) {
  const growthByMetric = calculateMetricSetGrowth(current, previous);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {DISPLAY_ORDER.map((metric, index) => (
        <motion.div
          key={metric}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <KpiCard
            metric={metric}
            growth={growthByMetric[metric]}
            points={points}
            onClick={() => onSelectMetric?.(metric)}
          />
        </motion.div>
      ))}
    </div>
  );
}
