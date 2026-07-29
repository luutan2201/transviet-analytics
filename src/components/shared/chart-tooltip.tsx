import { formatFullNumber } from "@/utils/formatters";

interface ChartTooltipProps {
  readonly active?: boolean;
  readonly label?: string | number;
  readonly payload?: readonly {
    readonly name: string;
    readonly value: number;
    readonly color: string;
  }[];
}

export function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="glass-surface rounded-[var(--radius-tooltip)] px-3.5 py-2.5 shadow-[var(--shadow-hover)]">
      {label && (
        <p className="mb-1.5 text-xs font-medium text-[var(--muted-foreground)]">{label}</p>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[var(--foreground)]">{formatFullNumber(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
