import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { KpiMetric } from "@/config/kpi";

export interface StoredKpiTarget {
  readonly id: string;
  readonly metric: KpiMetric;
  readonly target: number;
  readonly month: number;
  readonly year: number;
}

function buildTargetId(metric: KpiMetric, month: number, year: number): string {
  return `${metric}-${month}-${year}`;
}

interface KpiTargetsState {
  readonly targets: readonly StoredKpiTarget[];
  setTarget: (metric: KpiMetric, target: number, month: number, year: number) => void;
  removeTarget: (id: string) => void;
}

/**
 * Client-only KPI target storage. The user's Google Sheet has no "KPI" tab,
 * so targets set on the KPI page are stored locally (this browser only) —
 * per explicit request, no write-back to Google Sheet.
 */
export const useKpiTargetsStore = create<KpiTargetsState>()(
  persist(
    (set) => ({
      targets: [],
      setTarget: (metric, target, month, year) =>
        set((state) => {
          const id = buildTargetId(metric, month, year);
          const withoutExisting = state.targets.filter((t) => t.id !== id);
          return { targets: [...withoutExisting, { id, metric, target, month, year }] };
        }),
      removeTarget: (id) => set((state) => ({ targets: state.targets.filter((t) => t.id !== id) })),
    }),
    { name: "transviet-analytics-kpi-targets" }
  )
);
