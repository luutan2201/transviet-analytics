import { KPI_STATUS_THRESHOLDS, type KpiStatus } from "@/config/kpi";

/** Completion % = current/target×100. Returns 0 if target is 0 (avoid divide by zero). */
export function calculateCompletion(current: number, target: number): number {
  if (target === 0) return 0;
  return (current / target) * 100;
}

/** Remaining = target - current, never negative. */
export function calculateRemaining(current: number, target: number): number {
  return Math.max(target - current, 0);
}

/** Maps a completion percentage to a status bucket using configurable thresholds. */
export function calculateStatus(completion: number): KpiStatus {
  const entries = Object.entries(KPI_STATUS_THRESHOLDS) as [
    KpiStatus,
    { min: number; max: number },
  ][];
  const match = entries.find(([, range]) => completion >= range.min && completion <= range.max);
  return match ? match[0] : "critical";
}

/** Derives calendar quarter (1-4) from a month number (1-12). */
export function monthToQuarter(month: number): number {
  return Math.ceil(month / 3);
}
