"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { ChartContainer } from "@/components/shared/data-containers";
import { SelectField } from "@/components/ui/select-field";
import { EmptyState } from "@/components/shared/empty-state";
import { AreaChartEngine } from "@/components/charts/area-chart";
import { SUPPORTED_KPI_METRICS } from "@/config/kpi";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import type { WeeklyMetricPoint } from "@/features/dashboard/types/dashboard.model";
import { CHART_SERIES_COLORS } from "@/config/colors";

interface PerformanceSectionProps {
  readonly points: readonly WeeklyMetricPoint[];
}

const METRIC_OPTIONS = SUPPORTED_KPI_METRICS.map((m) => ({ value: m, label: METRIC_LABELS[m] }));

export function PerformanceSection({ points }: PerformanceSectionProps) {
  const [metric, setMetric] = useState<(typeof SUPPORTED_KPI_METRICS)[number]>("reach");
  const color = CHART_SERIES_COLORS[metric];

  const chartData = points.map((p) => ({ label: p.week, [metric]: p[metric] }));

  return (
    <ChartContainer
      title="Performance"
      description="Xu hướng hiệu suất theo thời gian"
      actions={
        <SelectField
          className="w-40"
          options={METRIC_OPTIONS}
          value={metric}
          onChange={(e) => setMetric(e.target.value as (typeof SUPPORTED_KPI_METRICS)[number])}
        />
      }
    >
      {chartData.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="Chưa có dữ liệu"
          description="Không có dữ liệu cho khoảng thời gian đã chọn."
        />
      ) : (
        <AreaChartEngine
          data={chartData}
          xKey="label"
          series={[{ key: metric, label: METRIC_LABELS[metric], color }]}
        />
      )}
    </ChartContainer>
  );
}
