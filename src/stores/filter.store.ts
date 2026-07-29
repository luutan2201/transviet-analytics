import { create } from "zustand";

export type FilterPeriod = "week" | "month" | "quarter" | "year";

interface FilterState {
  readonly period: FilterPeriod;
  readonly year: number;
  readonly month: number | null;
  readonly quarter: number | null;
  readonly week: string | null;
  setPeriod: (period: FilterPeriod) => void;
  setYear: (year: number) => void;
  setMonth: (month: number | null) => void;
  setQuarter: (quarter: number | null) => void;
  setWeek: (week: string | null) => void;
  reset: () => void;
}

const now = new Date();

const initialState = {
  period: "month" as FilterPeriod,
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  quarter: null,
  week: null,
};

/**
 * Global Filter Store — the single source of truth for the active reporting period.
 * Every widget (KPI, Charts, Table, AI, Reports, Export) reads from this store.
 * See 23_FILTER_ENGINE.md.
 */
export const useFilterStore = create<FilterState>()((set) => ({
  ...initialState,
  setPeriod: (period) => set({ period }),
  setYear: (year) => set({ year }),
  setMonth: (month) => set({ month }),
  setQuarter: (quarter) => set({ quarter }),
  setWeek: (week) => set({ week }),
  reset: () => set(initialState),
}));
