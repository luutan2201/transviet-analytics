import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SIDEBAR_STORAGE_KEY } from "@/config/sidebar";

interface SidebarState {
  readonly isCollapsed: boolean;
  readonly isMobileOpen: boolean;
  readonly hasUserPreference: boolean;
  toggleCollapsed: () => void;
  setCollapsedAuto: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,
      hasUserPreference: false,
      toggleCollapsed: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed, hasUserPreference: true })),
      /** Used only for automatic tablet default — never overrides an explicit user choice. */
      setCollapsedAuto: (collapsed) =>
        set((state) => (state.hasUserPreference ? state : { isCollapsed: collapsed })),
      setMobileOpen: (open) => set({ isMobileOpen: open }),
    }),
    {
      name: SIDEBAR_STORAGE_KEY,
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
        hasUserPreference: state.hasUserPreference,
      }),
    }
  )
);
