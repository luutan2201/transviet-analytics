"use client";

import { ChartContainer } from "@/components/shared/data-containers";
import { RadarChartEngine, type RadarDataPoint } from "@/components/charts/radar-chart";
import { SUPPORTED_KPI_METRICS } from "@/config/kpi";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import type { MetricSet } from "@/features/dashboard/types/dashboard.model";

interface RadarSectionProps {
  readonly current: MetricSet;
}

/** Normalizes each metric to 0–100 relative to the highest value in the set, so scales don't distort the shape. */
function buildRadarData(current: MetricSet): RadarDataPoint[] {
  const values = SUPPORTED_KPI_METRICS.map((m) => current[m]);
  const max = Math.max(...values, 1);

  return SUPPORTED_KPI_METRICS.map((metric) => ({
    axis: METRIC_LABELS[metric],
    value: Math.round((current[metric] / max) * 100),
  }));
}

export function RadarSection({ current }: RadarSectionProps) {
  const data = buildRadarData(current);

  return (
    <ChartContainer title="Radar Analysis" description="So sánh tương quan giữa các chỉ số">
      <RadarChartEngine data={data} />
    </ChartContainer>
  );
}
