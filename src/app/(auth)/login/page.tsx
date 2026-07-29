import { Suspense } from "react";
import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { GlassCard, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/features/authentication/components/login-form";
import { APP_NAME } from "@/config/constants";

export const metadata: Metadata = { title: "Đăng nhập" };

export default function LoginPage() {
  return (
    <GlassCard className="w-full max-w-sm">
      <CardContent className="flex flex-col gap-6 p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-[var(--radius-button)] bg-[var(--primary)]">
            <BarChart3 className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[var(--foreground)]">{APP_NAME}</h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">Đăng nhập để tiếp tục</p>
          </div>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-xs text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} TransViet Cargo. All rights reserved.
        </p>
      </CardContent>
    </GlassCard>
  );
}
