import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_THEME, THEME_STORAGE_KEY, type ThemeMode } from "@/config/theme";

interface ThemeState {
  readonly mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: DEFAULT_THEME,
      setMode: (mode) => set({ mode }),
    }),
    { name: THEME_STORAGE_KEY }
  )
);
