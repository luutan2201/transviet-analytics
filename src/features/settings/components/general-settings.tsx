"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { SettingsSection } from "@/features/settings/components/settings-section";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { useSettingsStore } from "@/stores/settings.store";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/config/theme";

const THEME_OPTIONS: readonly { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const LANGUAGE_OPTIONS = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "English" },
];

export function GeneralSettings() {
  const { theme, setTheme } = useTheme();
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  return (
    <SettingsSection title="Giao diện" description="Tuỳ chỉnh giao diện và ngôn ngữ hiển thị">
      <div className="flex flex-col gap-2">
        <Label>Chế độ hiển thị</Label>
        <div className="flex gap-1 rounded-[var(--radius-button)] bg-[var(--muted)] p-1 sm:w-fit">
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex items-center gap-2 rounded-[calc(var(--radius-button)-4px)] px-4 py-2 text-sm font-medium transition-colors",
                  theme === option.value
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                <Icon className="size-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="language">Ngôn ngữ</Label>
        <SelectField
          id="language"
          className="w-48"
          options={LANGUAGE_OPTIONS}
          value={settings.language}
          onChange={(e) => updateSettings({ language: e.target.value as "vi" | "en" })}
        />
      </div>
    </SettingsSection>
  );
}
