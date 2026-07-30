import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { KpiMetric } from "@/config/kpi";

export type KpiPlatform = "facebook" | "linkedin";

export interface StoredKpiTarget {
  readonly id: string;
  readonly platform: KpiPlatform;
  readonly metric: KpiMetric;
  readonly target: number;
  readonly month: number;
  readonly year: number;
}

function buildTargetId(
  platform: KpiPlatform,
  metric: KpiMetric,
  month: number,
  year: number
): string {
  return `${platform}-${metric}-${month}-${year}`;
}

interface KpiTargetsState {
  readonly targets: readonly StoredKpiTarget[];
  setTarget: (
    platform: KpiPlatform,
    metric: KpiMetric,
    target: number,
    month: number,
    year: number
  ) => void;
  removeTarget: (id: string) => void;
}

/**
 * Client-only KPI target storage, scoped per platform. The user's Google
 * Sheet has no "KPI" tab for either platform, so targets set on the KPI
 * pages are stored locally (this browser only) — per explicit request, no
 * write-back to Google Sheet. Scoping by platform prevents a target set on
 * Facebook (e.g. "Followers") from leaking into LinkedIn's KPI page, since
 * both platforms share several metric keys.
 */
export const useKpiTargetsStore = create<KpiTargetsState>()(
  persist(
    (set) => ({
      targets: [],
      setTarget: (platform, metric, target, month, year) =>
        set((state) => {
          const id = buildTargetId(platform, metric, month, year);
          const withoutExisting = state.targets.filter((t) => t.id !== id);
          return { targets: [...withoutExisting, { id, platform, metric, target, month, year }] };
        }),
      removeTarget: (id) => set((state) => ({ targets: state.targets.filter((t) => t.id !== id) })),
    }),
    { name: "transviet-analytics-kpi-targets" }
  )
);
