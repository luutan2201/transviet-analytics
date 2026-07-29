"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchKpiTargets } from "@/features/kpi/services/kpi.service";
import { transformKpiData, type PeriodContext } from "@/features/kpi/utils/kpi.transformer";
import { useFilterStore } from "@/stores/filter.store";
import { useKpiTargetsStore } from "@/stores/kpi-targets.store";
import { CACHE_TTL } from "@/config/constants";
import { monthToQuarter } from "@/features/kpi/utils/kpi-calculation";
import type { MetricSet } from "@/features/dashboard/types/dashboard.model";
import type { KpiTargetRaw } from "@/features/kpi/types/kpi-api.schema";

export function useKpiData(current: MetricSet | undefined, previous: MetricSet | undefined) {
  const period = useFilterStore((s) => s.period);
  const year = useFilterStore((s) => s.year);
  const month = useFilterStore((s) => s.month);
  const quarter = useFilterStore((s) => s.quarter);
  const localTargets = useKpiTargetsStore((s) => s.targets);

  const targetsQuery = useQuery({
    queryKey: ["kpi-targets", year],
    queryFn: async () => {
      const result = await fetchKpiTargets({ year });
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    staleTime: CACHE_TTL.settings,
  });

  const kpiModels = useMemo(() => {
    if (!current || !previous || !targetsQuery.data) return null;

    // Merge Google Sheet targets (if any) with locally-set targets (this browser).
    // Local targets take priority when both exist for the same metric+period.
    const localAsRaw: KpiTargetRaw[] = localTargets
      .filter((t) => t.year === year)
      .map((t) => ({
        metric: t.metric,
        target: t.target,
        periodType: "month" as const,
        month: t.month,
        quarter: monthToQuarter(t.month),
        year: t.year,
        enabled: true,
      }));

    const mergedTargets = [...localAsRaw, ...targetsQuery.data];

    const periodContext: PeriodContext = { periodType: period, year, month, quarter };
    return transformKpiData(current, previous, mergedTargets, periodContext);
  }, [current, previous, targetsQuery.data, localTargets, period, year, month, quarter]);

  return {
    kpiModels,
    isLoading: targetsQuery.isLoading,
    isError: targetsQuery.isError,
    refetch: targetsQuery.refetch,
  };
}
