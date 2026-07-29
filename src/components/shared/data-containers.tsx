import { GlassCard } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly title?: string;
  readonly description?: string;
  readonly actions?: React.ReactNode;
}

export function ChartContainer({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <GlassCard
      className={cn("p-6", className)}
      style={{ borderRadius: "var(--radius-chart)" }}
      {...props}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>}
            {description && (
              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </GlassCard>
  );
}

export function TableContainer({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <GlassCard className={cn("overflow-hidden p-0", className)} {...props}>
      <div className="overflow-x-auto">{children}</div>
    </GlassCard>
  );
}
