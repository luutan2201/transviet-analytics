"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/features/authentication/services/auth.service";
import type { LoginRequest } from "@/features/authentication/types/auth.types";
import { useUserStore } from "@/stores/user.store";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_AUTHENTICATED_ROUTE } from "@/config/routes";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useUserStore((s) => s.setUser);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (result) => {
      if (!result.success || !result.username) {
        toast({
          title: "Đăng nhập thất bại",
          description: result.message ?? "Vui lòng kiểm tra lại thông tin đăng nhập.",
          variant: "error",
        });
        return;
      }

      setUser({ username: result.username });
      toast({ title: "Đăng nhập thành công", variant: "success" });

      const redirectTo = searchParams.get("redirect") ?? DEFAULT_AUTHENTICATED_ROUTE;
      router.push(redirectTo);
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Không thể đăng nhập",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại.",
        variant: "error",
      });
    },
  });
}
