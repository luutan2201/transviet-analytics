"use client";

import { ChartContainer } from "@/components/shared/data-containers";
import { BarChartEngine } from "@/components/charts/bar-chart";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import type { KpiModel } from "@/features/kpi/types/kpi.model";
import { EmptyState } from "@/components/shared/empty-state";
import { BarChart3 } from "lucide-react";

interface KpiForecastChartProps {
  readonly kpis: readonly KpiModel[];
}

export function KpiForecastChart({ kpis }: KpiForecastChartProps) {
  const configured = kpis.filter((k) => k.target !== null);

  if (configured.length === 0) {
    return (
      <ChartContainer title="Forecast" description="Dự báo hiệu suất cuối kỳ">
        <EmptyState
          icon={BarChart3}
          title="Chưa có KPI nào được cấu hình"
          description="Thêm mục tiêu KPI trong Google Sheet để xem dự báo."
        />
      </ChartContainer>
    );
  }

  const data = configured.map((k) => ({
    label: METRIC_LABELS[k.metric],
    "Hiện tại": k.current,
    "Dự báo": k.forecast ?? 0,
    "Mục tiêu": k.target ?? 0,
  }));

  return (
    <ChartContainer title="Forecast" description="So sánh hiện tại · dự báo · mục tiêu">
      <BarChartEngine
        data={data}
        xKey="label"
        series={[
          { key: "Hiện tại", label: "Hiện tại", color: "#3b82f6" },
          { key: "Dự báo", label: "Dự báo", color: "#8b5cf6" },
          { key: "Mục tiêu", label: "Mục tiêu", color: "var(--color-success)" },
        ]}
      />
    </ChartContainer>
  );
}
