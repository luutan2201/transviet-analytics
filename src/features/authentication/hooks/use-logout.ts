"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/features/authentication/services/auth.service";
import { useUserStore } from "@/stores/user.store";
import { ROUTES } from "@/config/routes";

export function useLogout() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      setUser(null);
      router.push(ROUTES.login);
      router.refresh();
    },
  });
}
