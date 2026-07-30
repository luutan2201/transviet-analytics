"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchKpiTargets } from "@/features/kpi/services/kpi.service";
import { transformKpiData, type PeriodContext } from "@/features/kpi/utils/kpi.transformer";
import { useFilterStore } from "@/stores/filter.store";
import { useKpiTargetsStore, type KpiPlatform } from "@/stores/kpi-targets.store";
import { CACHE_TTL } from "@/config/constants";
import { monthToQuarter } from "@/features/kpi/utils/kpi-calculation";
import { FACEBOOK_METRICS, type KpiMetric } from "@/config/kpi";
import type { MetricSet } from "@/features/dashboard/types/dashboard.model";
import type { KpiTargetRaw } from "@/features/kpi/types/kpi-api.schema";

interface UseKpiDataOptions {
  /** Which platform's KPI page this is for — scopes local targets and (Facebook-only) sheet fetch. */
  readonly platform?: KpiPlatform;
  /** Restricts which metrics are computed — defaults to the original 8 (Facebook). */
  readonly metrics?: readonly KpiMetric[];
}

export function useKpiData(
  current: MetricSet | undefined,
  previous: MetricSet | undefined,
  options: UseKpiDataOptions = {}
) {
  const platform = options.platform ?? "facebook";
  const metrics = options.metrics ?? FACEBOOK_METRICS;

  const period = useFilterStore((s) => s.period);
  const year = useFilterStore((s) => s.year);
  const month = useFilterStore((s) => s.month);
  const quarter = useFilterStore((s) => s.quarter);
  const localTargets = useKpiTargetsStore((s) => s.targets);

  // Only Facebook has a Google Sheet "KPI" tab to read from — LinkedIn's
  // targets are local-only (the user's LinkedIn sheet has no KPI tab).
  const targetsQuery = useQuery({
    queryKey: ["kpi-targets", platform, year],
    queryFn: async () => {
      if (platform !== "facebook") return [] as readonly KpiTargetRaw[];
      const result = await fetchKpiTargets({ year });
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    staleTime: CACHE_TTL.settings,
  });

  const kpiModels = useMemo(() => {
    if (!current || !previous || !targetsQuery.data) return null;

    const localAsRaw: KpiTargetRaw[] = localTargets
      .filter((t) => t.platform === platform && t.year === year)
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
    return transformKpiData(current, previous, mergedTargets, periodContext, metrics);
  }, [
    current,
    previous,
    targetsQuery.data,
    localTargets,
    platform,
    period,
    year,
    month,
    quarter,
    metrics,
  ]);

  return {
    kpiModels,
    isLoading: targetsQuery.isLoading,
    isError: targetsQuery.isError,
    refetch: targetsQuery.refetch,
  };
}
