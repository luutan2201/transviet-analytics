import { Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  readonly icon?: LucideIcon;
  readonly title: string;
  readonly description?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-[var(--radius-card)] border border-dashed border-[var(--border)] p-12 text-center",
        className
      )}
    >
      <div className="glass-surface flex size-16 items-center justify-center rounded-full">
        <Icon className="size-7 text-[var(--muted-foreground)]" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-medium text-[var(--foreground)]">{title}</p>
        {description && (
          <p className="max-w-sm text-sm text-[var(--muted-foreground)]">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
