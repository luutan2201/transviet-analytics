"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/features/authentication/hooks/use-login";

const loginFormSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "", rememberMe: false },
  });

  function onSubmit(values: LoginFormValues) {
    login.mutate(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">Tên đăng nhập</Label>
        <Input
          id="username"
          autoComplete="username"
          placeholder="admin"
          aria-invalid={!!errors.username}
          {...register("username")}
        />
        {errors.username && (
          <p className="text-xs text-[var(--color-danger)]">{errors.username.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-[var(--color-danger)]">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="rememberMe"
          type="checkbox"
          className="size-4 rounded border-[var(--border)] accent-[var(--primary)]"
          {...register("rememberMe")}
        />
        <Label
          htmlFor="rememberMe"
          className="cursor-pointer font-normal text-[var(--muted-foreground)]"
        >
          Ghi nhớ đăng nhập
        </Label>
      </div>

      <Button type="submit" size="lg" className="mt-2 w-full" loading={login.isPending}>
        Đăng nhập
      </Button>
    </form>
  );
}
