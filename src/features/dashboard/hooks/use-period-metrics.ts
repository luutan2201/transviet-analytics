"use client";

import { useMemo } from "react";
import { useFilterStore } from "@/stores/filter.store";
import { selectPeriodMetrics } from "@/features/dashboard/utils/period-selector";
import type { DashboardModel } from "@/features/dashboard/types/dashboard.model";

export function usePeriodMetrics(model: DashboardModel | undefined) {
  const period = useFilterStore((s) => s.period);
  const year = useFilterStore((s) => s.year);
  const month = useFilterStore((s) => s.month);
  const quarter = useFilterStore((s) => s.quarter);
  const week = useFilterStore((s) => s.week);

  return useMemo(() => {
    if (!model) return null;
    return selectPeriodMetrics(model, { period, year, month, quarter, week });
  }, [model, period, year, month, quarter, week]);
}
