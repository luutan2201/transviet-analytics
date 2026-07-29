"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartTooltip } from "@/components/shared/chart-tooltip";
import { CHART_DEFAULTS } from "@/config/chart";
import { formatCompactNumber } from "@/utils/formatters";

export interface LineChartSeries {
  readonly key: string;
  readonly label: string;
  readonly color: string;
}

interface LineChartEngineProps {
  readonly data: readonly Record<string, string | number>[];
  readonly xKey: string;
  readonly series: readonly LineChartSeries[];
  readonly height?: number;
}

export function LineChartEngine({ data, xKey, series, height = 288 }: LineChartEngineProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={[...data]} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
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
                payload={payload?.map((p) => ({
                  name: String(p.name),
                  value: Number(p.value),
                  color: String(p.color),
                }))}
              />
            )}
          />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2.5}
              dot={{ r: 4, fill: s.color, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
              animationDuration={CHART_DEFAULTS.animationDurationMs}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
