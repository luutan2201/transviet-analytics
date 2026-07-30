"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLinkedInDashboard } from "@/features/linkedin/services/linkedin.service";
import { useFilterStore } from "@/stores/filter.store";
import { CACHE_TTL } from "@/config/constants";

export function useLinkedInDashboard() {
  const year = useFilterStore((s) => s.year);

  return useQuery({
    queryKey: ["linkedin-dashboard", year],
    queryFn: async () => {
      const result = await fetchLinkedInDashboard({ year });
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    staleTime: CACHE_TTL.dashboard,
  });
}
