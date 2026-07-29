import { useSettingsStore } from "@/stores/settings.store";

export function resolveAppsScriptUrl(envUrl: string | undefined): string | undefined {
  if (typeof window === "undefined") return envUrl;
  const override = useSettingsStore.getState().settings.appsScriptUrlOverride;
  return override || envUrl;
}
