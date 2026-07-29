"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchKpiTargets } from "@/features/kpi/services/kpi.service";
import { transformKpiData } from "@/features/kpi/utils/kpi.transformer";
import { useFilterStore } from "@/stores/filter.store";
import { CACHE_TTL } from "@/config/constants";
import type { MetricSet } from "@/features/dashboard/types/dashboard.model";

export function useKpiData(current: MetricSet | undefined, previous: MetricSet | undefined) {
  const year = useFilterStore((s) => s.year);

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
    return transformKpiData(current, previous, targetsQuery.data);
  }, [current, previous, targetsQuery.data]);

  return {
    kpiModels,
    isLoading: targetsQuery.isLoading,
    isError: targetsQuery.isError,
    refetch: targetsQuery.refetch,
  };
}
