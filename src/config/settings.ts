import type { ThemeMode } from "@/config/theme";

export interface AppSettings {
  readonly theme: ThemeMode;
  readonly brandColor: string;
  readonly logoDataUrl: string | null;
  readonly defaultYear: number;
  readonly defaultFilter: "week" | "month" | "quarter" | "year";
  readonly language: "vi" | "en";
  /** Runtime override for the Apps Script URL — takes priority over NEXT_PUBLIC_APPS_SCRIPT_URL. */
  readonly appsScriptUrlOverride: string | null;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  brandColor: "#147e93",
  logoDataUrl: null,
  defaultYear: new Date().getFullYear(),
  defaultFilter: "month",
  language: "vi",
  appsScriptUrlOverride: null,
};
