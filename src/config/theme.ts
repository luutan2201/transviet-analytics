export const THEME_MODES = ["dark", "light", "system"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

/** Dark mode is the default experience per 02_UI_Design_system.md. */
export const DEFAULT_THEME: ThemeMode = "dark";

export const THEME_STORAGE_KEY = "transviet-analytics-theme";
