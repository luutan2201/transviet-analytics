"use client";

import { useState } from "react";
import { ChartContainer } from "@/components/shared/data-containers";
import { LineChartEngine } from "@/components/charts/line-chart";
import { SelectField } from "@/components/ui/select-field";
import { EmptyState } from "@/components/shared/empty-state";
import { SUPPORTED_KPI_METRICS, type KpiMetric } from "@/config/kpi";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import type { WeeklyMetricPoint } from "@/features/dashboard/types/dashboard.model";
import { CHART_SERIES_COLORS } from "@/config/colors";
import { BarChart3 } from "lucide-react";

interface MonthlyComparisonSectionProps {
  readonly monthly: readonly WeeklyMetricPoint[];
  /** Restricts which metrics are selectable — defaults to all 8. */
  readonly metrics?: readonly KpiMetric[];
}

const MONTH_NAMES = [
  "Th1",
  "Th2",
  "Th3",
  "Th4",
  "Th5",
  "Th6",
  "Th7",
  "Th8",
  "Th9",
  "Th10",
  "Th11",
  "Th12",
];

export function MonthlyComparisonSection({ monthly, metrics }: MonthlyComparisonSectionProps) {
  const availableMetrics = metrics ?? SUPPORTED_KPI_METRICS;
  const metricOptions = availableMetrics.map((m) => ({ value: m, label: METRIC_LABELS[m] }));
  const [metric, setMetric] = useState<KpiMetric>(availableMetrics[0] ?? "reach");
  const color = CHART_SERIES_COLORS[metric];

  const sorted = [...monthly].sort((a, b) => a.month - b.month);
  const chartData = sorted.map((m) => ({
    label: MONTH_NAMES[m.month - 1] ?? `Th${m.month}`,
    [metric]: m[metric],
  }));

  return (
    <ChartContainer
      title="So sánh theo tháng"
      description="Xu hướng tăng/giảm giữa các tháng từ đầu năm"
      actions={
        <SelectField
          className="w-40"
          options={metricOptions}
          value={metric}
          onChange={(e) => setMetric(e.target.value as KpiMetric)}
        />
      }
    >
      {chartData.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Chưa có đủ dữ liệu"
          description="Cần dữ liệu ít nhất 1 tháng để so sánh."
        />
      ) : (
        <LineChartEngine
          data={chartData}
          xKey="label"
          series={[{ key: metric, label: METRIC_LABELS[metric], color }]}
        />
      )}
    </ChartContainer>
  );
}
