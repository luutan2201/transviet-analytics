"use client";

import { SparklineChartEngine } from "@/components/charts/sparkline-chart";

interface KpiSparklineProps {
  readonly data: readonly { readonly value: number }[];
  readonly color: string;
  readonly gradientId: string;
}

/** Thin re-export so dashboard code depends on the feature layer, not the chart engine directly. */
export function KpiSparkline({ data, color, gradientId }: KpiSparklineProps) {
  return <SparklineChartEngine data={data} color={color} gradientId={gradientId} />;
}
