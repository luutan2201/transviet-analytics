"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { AreaChartEngine } from "@/components/charts/area-chart";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import type { WeeklyMetricPoint } from "@/features/dashboard/types/dashboard.model";
import type { KpiMetric } from "@/config/kpi";
import { CHART_SERIES_COLORS } from "@/config/colors";
import { formatFullNumber } from "@/utils/formatters";

interface MetricDetailDrawerProps {
  readonly metric: KpiMetric | null;
  readonly points: readonly WeeklyMetricPoint[];
  readonly onClose: () => void;
}

export function MetricDetailDrawer({ metric, points, onClose }: MetricDetailDrawerProps) {
  if (!metric) return null;

  const color = CHART_SERIES_COLORS[metric];
  const chartData = points.map((p) => ({ label: p.week, [metric]: p[metric] }));
  const total = points.reduce((sum, p) => sum + p[metric], 0);
  const average = points.length > 0 ? total / points.length : 0;

  return (
    <Drawer open={metric !== null} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{METRIC_LABELS[metric]}</DrawerTitle>
          <p className="text-sm text-[var(--muted-foreground)]">Xu hướng theo tuần</p>
        </DrawerHeader>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="glass-surface rounded-[var(--radius-lg)] p-4">
            <p className="text-xs text-[var(--muted-foreground)]">Tổng</p>
            <p className="mt-1 text-lg font-bold text-[var(--foreground)]">
              {formatFullNumber(total)}
            </p>
          </div>
          <div className="glass-surface rounded-[var(--radius-lg)] p-4">
            <p className="text-xs text-[var(--muted-foreground)]">Trung bình / tuần</p>
            <p className="mt-1 text-lg font-bold text-[var(--foreground)]">
              {formatFullNumber(Math.round(average))}
            </p>
          </div>
        </div>

        <AreaChartEngine
          data={chartData}
          xKey="label"
          series={[{ key: metric, label: METRIC_LABELS[metric], color }]}
          height={256}
        />
      </DrawerContent>
    </Drawer>
  );
}
