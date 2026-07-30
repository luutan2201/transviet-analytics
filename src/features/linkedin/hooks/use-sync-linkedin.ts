"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLinkedInDashboard } from "@/features/linkedin/services/linkedin.service";
import { useFilterStore } from "@/stores/filter.store";
import { useToast } from "@/hooks/use-toast";

export function useSyncLinkedIn() {
  const queryClient = useQueryClient();
  const year = useFilterStore((s) => s.year);
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => fetchLinkedInDashboard({ year, force: true }),
    onSuccess: (result) => {
      if (!result.ok) {
        toast({ title: "Đồng bộ thất bại", description: result.error.message, variant: "error" });
        return;
      }
      queryClient.setQueryData(["linkedin-dashboard", year], result.data);
      toast({ title: "Đồng bộ dữ liệu LinkedIn thành công", variant: "success" });
    },
    onError: () => {
      toast({ title: "Không thể đồng bộ dữ liệu", variant: "error" });
    },
  });
}
