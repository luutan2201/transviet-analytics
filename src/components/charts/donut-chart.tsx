"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCompactNumber } from "@/utils/formatters";

export interface DonutSlice {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly color: string;
}

interface DonutChartEngineProps {
  readonly data: readonly DonutSlice[];
  readonly height?: number;
  readonly centerLabel?: string;
  readonly centerValue?: string;
}

export function DonutChartEngine({
  data,
  height = 260,
  centerLabel,
  centerValue,
}: DonutChartEngineProps) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[...data]}
            dataKey="value"
            nameKey="label"
            innerRadius="62%"
            outerRadius="90%"
            paddingAngle={2}
            animationDuration={500}
          >
            {data.map((slice) => (
              <Cell key={slice.key} fill={slice.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const slice = payload[0].payload as DonutSlice;
              return (
                <div className="glass-surface rounded-[var(--radius-tooltip)] px-3 py-2 text-xs text-[var(--foreground)] shadow-[var(--shadow-hover)]">
                  {slice.label}: {formatCompactNumber(slice.value)}
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="text-xl font-bold text-[var(--foreground)]">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-xs text-[var(--muted-foreground)]">{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
