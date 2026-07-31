"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Flame, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateEngagementRate } from "@/features/dashboard/utils/engagement";
import { calculateGrowth } from "@/features/dashboard/utils/growth";
import { formatPercent, formatSignedPercent } from "@/utils/formatters";
import type { MetricSet, WeeklyMetricPoint } from "@/features/dashboard/types/dashboard.model";

const KpiSparkline = dynamic(
  () => import("@/features/dashboard/components/kpi-sparkline").then((m) => m.KpiSparkline),
  { loading: () => <Skeleton className="h-full w-full rounded-[var(--radius-sm)]" />, ssr: false }
);

const ENGAGEMENT_COLOR = "#f97316";

const TREND_ICON = { up: TrendingUp, down: TrendingDown, stable: Minus } as const;

interface EngagementRateCardProps {
  readonly current: MetricSet;
  readonly previous: MetricSet;
  readonly points: readonly WeeklyMetricPoint[];
}

export function EngagementRateCard({ current, previous, points }: EngagementRateCardProps) {
  const currentRate = calculateEngagementRate(current);
  const previousRate = calculateEngagementRate(previous);
  const growth = calculateGrowth(currentRate, previousRate);
  const TrendIcon = TREND_ICON[growth.trend];

  const sparklineData = points.map((p) => ({ value: calculateEngagementRate(p) }));

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
      <GlassCard className="flex h-full flex-col gap-1.5 p-2.5 transition-shadow hover:shadow-[var(--shadow-hover)] sm:gap-4 sm:p-5">
        <div className="flex items-center justify-between gap-1">
          <div
            className="flex size-6 shrink-0 items-center justify-center rounded-[var(--radius-sm)] sm:size-10 sm:rounded-[var(--radius-md)]"
            style={{ backgroundColor: `color-mix(in srgb, ${ENGAGEMENT_COLOR} 16%, transparent)` }}
          >
            <Flame className="size-3.5 sm:size-5" style={{ color: ENGAGEMENT_COLOR }} />
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
            Engagement Rate
          </p>
          <p className="mt-0.5 text-sm font-bold tracking-tight text-[var(--foreground)] sm:mt-1 sm:text-2xl">
            {formatPercent(currentRate)}
          </p>
        </div>

        <div className="-mx-1 hidden h-12 sm:block">
          <KpiSparkline
            data={sparklineData}
            color={ENGAGEMENT_COLOR}
            gradientId="sparkline-engagement"
          />
        </div>
      </GlassCard>
    </motion.div>
  );
}
