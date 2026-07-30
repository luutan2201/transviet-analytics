"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { METRIC_ICONS } from "@/features/dashboard/config/metric-icons";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import type { WeeklyMetricPoint } from "@/features/dashboard/types/dashboard.model";
import type { MetricGrowth } from "@/features/dashboard/utils/growth";
import { formatCompactNumber, formatSignedPercent } from "@/utils/formatters";
import type { KpiMetric } from "@/config/kpi";
import { CHART_SERIES_COLORS } from "@/config/colors";

// Recharts is heavy — split it out of the eager KPI Grid bundle so the numbers/badges
// (the "understand business in 30 seconds" content) paint before the chart library loads.
const KpiSparkline = dynamic(
  () => import("@/features/dashboard/components/kpi-sparkline").then((m) => m.KpiSparkline),
  { loading: () => <Skeleton className="h-full w-full rounded-[var(--radius-sm)]" />, ssr: false }
);

interface KpiCardProps {
  readonly metric: KpiMetric;
  readonly growth: MetricGrowth;
  readonly points: readonly WeeklyMetricPoint[];
  readonly onClick?: () => void;
}

const TREND_CONFIG = {
  up: { icon: TrendingUp },
  down: { icon: TrendingDown },
  stable: { icon: Minus },
} as const;

function KpiCardBase({ metric, growth, points, onClick }: KpiCardProps) {
  const Icon = METRIC_ICONS[metric];
  const TrendIcon = TREND_CONFIG[growth.trend].icon;
  const color = CHART_SERIES_COLORS[metric];
  const sparklineData = points.map((p) => ({ value: p[metric] }));

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="text-left"
    >
      <GlassCard className="flex h-full flex-col gap-1.5 p-2.5 transition-shadow hover:shadow-[var(--shadow-hover)] sm:gap-4 sm:p-5">
        <div className="flex items-center justify-between gap-1">
          <div
            className="flex size-6 shrink-0 items-center justify-center rounded-[var(--radius-sm)] sm:size-10 sm:rounded-[var(--radius-md)]"
            style={{ backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)` }}
          >
            <Icon className="size-3.5 sm:size-5" style={{ color }} />
          </div>
          <Badge
            variant={
              growth.trend === "up" ? "success" : growth.trend === "down" ? "danger" : "neutral"
            }
            className="gap-0.5 px-1.5 py-0.5 text-[9px] sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs"
          >
            <TrendIcon className="size-2 sm:size-3" />
            <span className="truncate">{formatSignedPercent(growth.growthPercent)}</span>
          </Badge>
        </div>

        <div>
          <p className="truncate text-[10px] text-[var(--muted-foreground)] sm:text-sm">
            {METRIC_LABELS[metric]}
          </p>
          <p className="mt-0.5 text-sm font-bold tracking-tight text-[var(--foreground)] sm:mt-1 sm:text-2xl">
            {formatCompactNumber(growth.current)}
          </p>
        </div>

        <div className="-mx-1 hidden h-12 sm:block">
          <KpiSparkline data={sparklineData} color={color} gradientId={`sparkline-${metric}`} />
        </div>
      </GlassCard>
    </motion.button>
  );
}

export const KpiCard = memo(KpiCardBase);
