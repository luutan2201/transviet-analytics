"use client";

import { motion } from "framer-motion";
import { RefreshCw, CheckCircle2, Radio } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/card";
import { useSyncDashboard } from "@/features/dashboard/hooks/use-sync-dashboard";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

interface DashboardHeroProps {
  readonly lastSync: string | undefined;
}

export function DashboardHero({ lastSync }: DashboardHeroProps) {
  const sync = useSyncDashboard();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
              {getGreeting()}, Admin 👋
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1.5">
              <Radio className="size-4 text-[var(--primary)]" />
              Facebook
            </span>
            <span className="text-[var(--border)]">•</span>
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="size-3.5" />
              Hoạt động ổn định
            </Badge>
            {lastSync && (
              <>
                <span className="text-[var(--border)]">•</span>
                <span>
                  Đồng bộ lần cuối:{" "}
                  {formatDistanceToNow(new Date(lastSync), { addSuffix: true, locale: vi })}
                </span>
              </>
            )}
          </div>
        </div>

        <Button
          variant="secondary"
          size="md"
          className="gap-2"
          loading={sync.isPending}
          onClick={() => sync.mutate()}
        >
          <RefreshCw className={sync.isPending ? "size-4 animate-spin" : "size-4"} />
          Sync Data
        </Button>
      </GlassCard>
    </motion.div>
  );
}
