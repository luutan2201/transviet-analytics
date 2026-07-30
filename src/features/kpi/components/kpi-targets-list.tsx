"use client";

import { Trash2, CalendarClock } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useKpiTargetsStore, type KpiPlatform } from "@/stores/kpi-targets.store";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import { formatFullNumber } from "@/utils/formatters";

interface KpiTargetsListProps {
  readonly platform?: KpiPlatform;
}

export function KpiTargetsList({ platform = "facebook" }: KpiTargetsListProps) {
  const allTargets = useKpiTargetsStore((s) => s.targets);
  const removeTarget = useKpiTargetsStore((s) => s.removeTarget);
  const targets = allTargets.filter((t) => t.platform === platform);

  if (targets.length === 0) return null;

  const sorted = [...targets].sort((a, b) => a.year - b.year || a.month - b.month);

  return (
    <GlassCard className="flex flex-col gap-3 p-5">
      <div className="flex items-center gap-2">
        <CalendarClock className="size-4 text-[var(--primary)]" />
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Mục tiêu KPI đã đặt (trình duyệt này)
        </h3>
      </div>
      <div className="flex flex-col divide-y divide-[var(--border)]">
        {sorted.map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
            <div>
              <span className="font-medium text-[var(--foreground)]">
                {METRIC_LABELS[t.metric]}
              </span>
              <span className="ml-2 text-[var(--muted-foreground)]">
                Tháng {t.month}/{t.year} · Mục tiêu {formatFullNumber(t.target)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="iconOnly"
              aria-label="Xoá mục tiêu"
              onClick={() => removeTarget(t.id)}
            >
              <Trash2 className="size-4 text-[var(--color-danger)]" />
            </Button>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
