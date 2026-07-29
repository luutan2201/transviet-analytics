"use client";

import { useState } from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartTooltip } from "@/components/shared/chart-tooltip";
import { ChartLegend, type ChartLegendItem } from "@/components/charts/chart-legend";
import { CHART_DEFAULTS } from "@/config/chart";
import { formatCompactNumber } from "@/utils/formatters";

export interface AreaChartSeries {
  readonly key: string;
  readonly label: string;
  readonly color: string;
}

interface AreaChartEngineProps {
  readonly data: readonly Record<string, string | number>[];
  readonly xKey: string;
  readonly series: readonly AreaChartSeries[];
  readonly height?: number;
  readonly showLegend?: boolean;
}

export function AreaChartEngine({
  data,
  xKey,
  series,
  height = 288,
  showLegend = false,
}: AreaChartEngineProps) {
  const [hiddenKeys, setHiddenKeys] = useState<ReadonlySet<string>>(new Set());

  const legendItems: ChartLegendItem[] = series.map((s) => ({
    key: s.key,
    label: s.label,
    color: s.color,
  }));

  function toggleSeries(key: string) {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {showLegend && (
        <ChartLegend items={legendItems} hiddenKeys={hiddenKeys} onToggle={toggleSeries} />
      )}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={[...data]} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`area-fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              opacity={CHART_DEFAULTS.gridOpacity * 4}
            />
            <XAxis
              dataKey={xKey}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => formatCompactNumber(v)}
              width={48}
            />
            <Tooltip
              content={({ active, label, payload }) => (
                <ChartTooltip
                  active={active}
                  label={label}
                  payload={payload
                    ?.filter((p) => !hiddenKeys.has(String(p.dataKey)))
                    .map((p) => ({
                      name: String(p.name),
                      value: Number(p.value),
                      color: String(p.color),
                    }))}
                />
              )}
            />
            {series.map((s) =>
              hiddenKeys.has(s.key) ? null : (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2.5}
                  fill={`url(#area-fill-${s.key})`}
                  animationDuration={CHART_DEFAULTS.animationDurationMs}
                />
              )
            )}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
