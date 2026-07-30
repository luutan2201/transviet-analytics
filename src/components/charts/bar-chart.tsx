"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartTooltip } from "@/components/shared/chart-tooltip";
import { CHART_DEFAULTS } from "@/config/chart";
import { formatCompactNumber } from "@/utils/formatters";

export interface BarChartSeries {
  readonly key: string;
  readonly label: string;
  readonly color: string;
}

interface BarChartEngineProps {
  readonly data: readonly Record<string, string | number>[];
  readonly xKey: string;
  readonly series: readonly BarChartSeries[];
  readonly stacked?: boolean;
  readonly height?: number;
  readonly horizontal?: boolean;
}

export function BarChartEngine({
  data,
  xKey,
  series,
  stacked = false,
  height = 288,
  horizontal = false,
}: BarChartEngineProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={[...data]}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{ left: horizontal ? 24 : 0, right: 8, top: 8, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={horizontal}
            horizontal={!horizontal}
            stroke="var(--border)"
            opacity={CHART_DEFAULTS.gridOpacity * 4}
          />
          {horizontal ? (
            <>
              <XAxis
                type="number"
                tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => formatCompactNumber(v)}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey={xKey}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={xKey}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => formatCompactNumber(v)}
                width={60}
                allowDecimals={false}
              />
            </>
          )}
          <Tooltip
            content={({ active, label, payload }) => (
              <ChartTooltip
                active={active}
                label={label}
                payload={payload?.map((p) => ({
                  name: String(p.name),
                  value: Number(p.value),
                  color: String(p.color),
                }))}
              />
            )}
          />
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={s.color}
              radius={[6, 6, 0, 0]}
              stackId={stacked ? "stack" : undefined}
              animationDuration={CHART_DEFAULTS.animationDurationMs}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
