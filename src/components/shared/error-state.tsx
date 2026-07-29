import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly onRetry?: () => void;
  readonly className?: string;
}

export function ErrorState({
  title = "Đã có sự cố xảy ra",
  description = "Không thể tải dữ liệu lúc này. Vui lòng thử lại sau ít phút.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-[var(--radius-card)] border border-[var(--border)] p-12 text-center",
        className
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-danger)_12%,transparent)]">
        <AlertCircle className="size-7 text-[var(--color-danger)]" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-medium text-[var(--foreground)]">{title}</p>
        <p className="max-w-sm text-sm text-[var(--muted-foreground)]">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  );
}
