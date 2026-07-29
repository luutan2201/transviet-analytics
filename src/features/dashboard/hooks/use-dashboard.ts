"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/features/dashboard/services/dashboard.service";
import { useFilterStore } from "@/stores/filter.store";
import { CACHE_TTL } from "@/config/constants";

export function useDashboard() {
  const year = useFilterStore((s) => s.year);

  return useQuery({
    queryKey: ["dashboard", year],
    queryFn: async () => {
      const result = await fetchDashboard({ year });
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    staleTime: CACHE_TTL.dashboard,
  });
}
