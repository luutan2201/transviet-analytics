"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { METRIC_ICONS } from "@/features/dashboard/config/metric-icons";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import type { KpiModel } from "@/features/kpi/types/kpi.model";
import {
  KPI_STATUS_LABELS,
  KPI_STATUS_BADGE_VARIANT,
  FORECAST_STATUS_LABELS,
  FORECAST_STATUS_COLORS,
} from "@/features/kpi/config/kpi-status-labels";
import { formatCompactNumber } from "@/utils/formatters";

interface KpiOverviewCardProps {
  readonly kpi: KpiModel;
  readonly onClick?: () => void;
}

const TREND_ICON = { up: TrendingUp, down: TrendingDown, stable: Minus } as const;

function KpiOverviewCardBase({ kpi, onClick }: KpiOverviewCardProps) {
  const Icon = METRIC_ICONS[kpi.metric];
  const TrendIcon = TREND_ICON[kpi.trend];
  const isNotConfigured = kpi.status === "notConfigured";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full text-left"
    >
      <GlassCard className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--primary)_16%,transparent)]">
              <Icon className="size-[18px] text-[var(--primary)]" />
            </div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              {METRIC_LABELS[kpi.metric]}
            </p>
          </div>
          <Badge variant={KPI_STATUS_BADGE_VARIANT[kpi.status]}>
            {KPI_STATUS_LABELS[kpi.status]}
          </Badge>
        </div>

        {isNotConfigured ? (
          <div className="flex flex-1 flex-col justify-center gap-1 py-2">
            <p className="text-lg font-bold text-[var(--foreground)]">
              {formatCompactNumber(kpi.current)}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">Chưa cấu hình mục tiêu KPI</p>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xl font-bold text-[var(--foreground)]">
                  {formatCompactNumber(kpi.current)}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  / {formatCompactNumber(kpi.target ?? 0)} mục tiêu
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                <TrendIcon className="size-3.5" />
                {formatCompactNumber(kpi.remaining ?? 0)} còn lại
              </div>
            </div>

            <Progress value={kpi.completion ?? 0} />

            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--muted-foreground)]">
                Hoàn thành {(kpi.completion ?? 0).toFixed(1)}%
              </span>
              {kpi.forecastStatus && (
                <span style={{ color: FORECAST_STATUS_COLORS[kpi.forecastStatus] }}>
                  Dự báo: {FORECAST_STATUS_LABELS[kpi.forecastStatus]}
                </span>
              )}
            </div>
          </>
        )}
      </GlassCard>
    </motion.button>
  );
}

export const KpiOverviewCard = memo(KpiOverviewCardBase);
