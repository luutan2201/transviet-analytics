"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body className="app-gradient-bg flex min-h-screen items-center justify-center p-4">
        <GlassCard className="flex max-w-md flex-col items-center gap-4 p-10 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-danger)_14%,transparent)]">
            <AlertTriangle className="size-6 text-[var(--color-danger)]" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Đã có sự cố xảy ra</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Ứng dụng gặp lỗi ngoài dự kiến. Vui lòng thử lại.
          </p>
          <Button onClick={() => reset()}>Thử lại</Button>
        </GlassCard>
      </body>
    </html>
  );
}
