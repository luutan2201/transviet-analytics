import { PageHeader } from "@/components/shared/layout-primitives";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

interface ComingSoonPageProps {
  readonly title: string;
  readonly subtitle: string;
  readonly icon: LucideIcon;
}

export function ComingSoonPage({ title, subtitle, icon: Icon }: ComingSoonPageProps) {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={title} subtitle={subtitle} />
      <GlassCard className="flex flex-col items-center justify-center gap-4 p-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_14%,transparent)]">
          <Icon className="size-7 text-[var(--primary)]" />
        </div>
        <Badge variant="primary">Coming soon</Badge>
        <p className="max-w-md text-sm text-[var(--muted-foreground)]">
          Module này sẽ được triển khai ở giai đoạn tiếp theo, theo đúng Task Breakdown.
        </p>
      </GlassCard>
    </div>
  );
}
