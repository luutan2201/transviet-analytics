import { GlassCard } from "@/components/ui/card";

interface SettingsSectionProps {
  readonly title: string;
  readonly description?: string;
  readonly children: React.ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <GlassCard className="flex flex-col gap-5 p-6">
      <div>
        <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
        )}
      </div>
      {children}
    </GlassCard>
  );
}
