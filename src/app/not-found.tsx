import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";

export default function NotFound() {
  return (
    <div className="app-gradient-bg flex min-h-screen items-center justify-center p-4">
      <GlassCard className="flex max-w-md flex-col items-center gap-4 p-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_14%,transparent)]">
          <Compass className="size-6 text-[var(--primary)]" />
        </div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Không tìm thấy trang</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Trang bạn tìm không tồn tại hoặc đã được di chuyển.
        </p>
        <Button asChild>
          <Link href={ROUTES.dashboard}>Về Dashboard</Link>
        </Button>
      </GlassCard>
    </div>
  );
}
