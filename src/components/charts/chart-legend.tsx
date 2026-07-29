"use client";

import { cn } from "@/lib/utils";

export interface ChartLegendItem {
  readonly key: string;
  readonly label: string;
  readonly color: string;
}

interface ChartLegendProps {
  readonly items: readonly ChartLegendItem[];
  readonly hiddenKeys: ReadonlySet<string>;
  readonly onToggle: (key: string) => void;
}

/**
 * Shared legend for every multi-series chart in the app.
 * Clicking a series dims/hides it — the chart component reads `hiddenKeys` to filter.
 */
export function ChartLegend({ items, hiddenKeys, onToggle }: ChartLegendProps) {
  return (
    <div className="flex flex-wrap items-center gap-4" style={{ gap: "var(--space-4)" }}>
      {items.map((item) => {
        const isHidden = hiddenKeys.has(item.key);
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onToggle(item.key)}
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium transition-opacity",
              isHidden ? "opacity-40" : "opacity-100"
            )}
          >
            <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[var(--foreground)]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
