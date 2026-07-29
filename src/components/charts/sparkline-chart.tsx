"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface SparklineChartEngineProps {
  readonly data: readonly { readonly value: number }[];
  readonly color: string;
  readonly gradientId: string;
}

export function SparklineChartEngine({ data, color, gradientId }: SparklineChartEngineProps) {
  if (data.length <= 1) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={[...data]}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          isAnimationActive
          animationDuration={600}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
