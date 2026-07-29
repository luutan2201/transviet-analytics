import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { env } from "@/config/env";

interface DashboardFooterProps {
  readonly lastSync?: string;
}

export function DashboardFooter({ lastSync }: DashboardFooterProps) {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 border-t border-[var(--border)] py-6 text-xs text-[var(--muted-foreground)] sm:flex-row">
      <p>
        © {new Date().getFullYear()} TransViet Analytics · v{env.NEXT_PUBLIC_APP_VERSION}
      </p>
      {lastSync && (
        <p>
          Đồng bộ lần cuối:{" "}
          {formatDistanceToNow(new Date(lastSync), { addSuffix: true, locale: vi })}
        </p>
      )}
    </footer>
  );
}
