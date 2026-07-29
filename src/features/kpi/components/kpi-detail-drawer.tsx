"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChartEngine } from "@/components/charts/area-chart";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import type { WeeklyMetricPoint } from "@/features/dashboard/types/dashboard.model";
import type { KpiModel } from "@/features/kpi/types/kpi.model";
import {
  KPI_STATUS_LABELS,
  KPI_STATUS_BADGE_VARIANT,
  FORECAST_STATUS_LABELS,
  FORECAST_STATUS_COLORS,
} from "@/features/kpi/config/kpi-status-labels";
import { CHART_SERIES_COLORS } from "@/config/colors";
import { formatCompactNumber, formatFullNumber } from "@/utils/formatters";
import { Lightbulb } from "lucide-react";

interface KpiDetailDrawerProps {
  readonly kpi: KpiModel | null;
  readonly points: readonly WeeklyMetricPoint[];
  readonly onClose: () => void;
}

export function KpiDetailDrawer({ kpi, points, onClose }: KpiDetailDrawerProps) {
  if (!kpi) return null;

  const color = CHART_SERIES_COLORS[kpi.metric];
  const chartData = points.map((p) => ({ label: p.week, [kpi.metric]: p[kpi.metric] }));

  return (
    <Drawer open={kpi !== null} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>{METRIC_LABELS[kpi.metric]}</DrawerTitle>
            <Badge variant={KPI_STATUS_BADGE_VARIANT[kpi.status]}>
              {KPI_STATUS_LABELS[kpi.status]}
            </Badge>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">Chi tiết KPI theo tuần</p>
        </DrawerHeader>

        {kpi.target !== null && (
          <div className="mb-6 flex flex-col gap-3">
            <Progress value={kpi.completion ?? 0} />
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="glass-surface rounded-[var(--radius-lg)] p-3">
                <p className="text-xs text-[var(--muted-foreground)]">Hiện tại</p>
                <p className="mt-1 text-sm font-bold text-[var(--foreground)]">
                  {formatCompactNumber(kpi.current)}
                </p>
              </div>
              <div className="glass-surface rounded-[var(--radius-lg)] p-3">
                <p className="text-xs text-[var(--muted-foreground)]">Mục tiêu</p>
                <p className="mt-1 text-sm font-bold text-[var(--foreground)]">
                  {formatCompactNumber(kpi.target)}
                </p>
              </div>
              <div className="glass-surface rounded-[var(--radius-lg)] p-3">
                <p className="text-xs text-[var(--muted-foreground)]">Còn lại</p>
                <p className="mt-1 text-sm font-bold text-[var(--foreground)]">
                  {formatCompactNumber(kpi.remaining ?? 0)}
                </p>
              </div>
            </div>
            {kpi.forecast !== null && kpi.forecastStatus && (
              <div className="glass-surface flex items-center justify-between rounded-[var(--radius-lg)] p-3 text-sm">
                <span className="text-[var(--muted-foreground)]">Dự báo cuối kỳ</span>
                <span style={{ color: FORECAST_STATUS_COLORS[kpi.forecastStatus] }}>
                  {formatFullNumber(kpi.forecast)} · {FORECAST_STATUS_LABELS[kpi.forecastStatus]}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          <AreaChartEngine
            data={chartData}
            xKey="label"
            series={[{ key: kpi.metric, label: METRIC_LABELS[kpi.metric], color }]}
            height={220}
          />
        </div>

        <div className="glass-surface flex items-start gap-2 rounded-[var(--radius-lg)] p-4">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-[var(--primary)]" />
          <p className="text-sm text-[var(--foreground)]">{kpi.recommendation}</p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
