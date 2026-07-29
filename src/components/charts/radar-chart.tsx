"use client";

import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { BRAND_COLORS } from "@/config/colors";

export interface RadarDataPoint {
  readonly axis: string;
  readonly value: number;
}

interface RadarChartEngineProps {
  readonly data: readonly RadarDataPoint[];
  readonly color?: string;
  readonly height?: number;
}

export function RadarChartEngine({
  data,
  color = BRAND_COLORS.primary,
  height = 320,
}: RadarChartEngineProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={[...data]} outerRadius="72%">
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
          <Radar
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.3}
            strokeWidth={2}
            animationDuration={500}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              return (
                <div className="glass-surface rounded-[var(--radius-tooltip)] px-3 py-2 text-xs text-[var(--foreground)] shadow-[var(--shadow-hover)]">
                  {payload[0].payload.axis}: {payload[0].value}
                </div>
              );
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
