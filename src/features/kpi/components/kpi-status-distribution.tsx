"use client";

import { ChartContainer } from "@/components/shared/data-containers";
import { DonutChartEngine, type DonutSlice } from "@/components/charts/donut-chart";
import type { KpiModel } from "@/features/kpi/types/kpi.model";
import { KPI_STATUS_LABELS } from "@/features/kpi/config/kpi-status-labels";
import { KPI_STATUS_COLORS } from "@/config/colors";
import type { KpiStatus } from "@/config/kpi";

interface KpiStatusDistributionProps {
  readonly kpis: readonly KpiModel[];
}

export function KpiStatusDistribution({ kpis }: KpiStatusDistributionProps) {
  const configured = kpis.filter(
    (k): k is KpiModel & { status: KpiStatus } => k.status !== "notConfigured"
  );

  const counts = configured.reduce<Record<string, number>>((acc, k) => {
    acc[k.status] = (acc[k.status] ?? 0) + 1;
    return acc;
  }, {});

  const slices: DonutSlice[] = Object.entries(counts).map(([status, count]) => ({
    key: status,
    label: KPI_STATUS_LABELS[status as KpiStatus],
    value: count,
    color: KPI_STATUS_COLORS[status as KpiStatus],
  }));

  return (
    <ChartContainer
      title="Phân bố trạng thái KPI"
      description="Số lượng chỉ số theo từng trạng thái"
    >
      <DonutChartEngine data={slices} centerValue={String(configured.length)} centerLabel="KPI" />
    </ChartContainer>
  );
}
