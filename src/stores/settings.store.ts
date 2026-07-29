import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SETTINGS, type AppSettings } from "@/config/settings";

interface SettingsState {
  readonly settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (partial) =>
        set((state) => ({ settings: { ...state.settings, ...partial } })),
      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    { name: "transviet-analytics-settings" }
  )
);
