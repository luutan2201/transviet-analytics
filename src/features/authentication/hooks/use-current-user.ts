"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { authService } from "@/features/authentication/services/auth.service";
import { useUserStore } from "@/stores/user.store";

export function useCurrentUser() {
  const setUser = useUserStore((s) => s.setUser);
  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authService.getCurrentUser(),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.data !== undefined) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
}
