import type { KpiStatus } from "@/config/kpi";
import type { ForecastStatus } from "@/features/kpi/types/kpi.model";

export const KPI_STATUS_LABELS: Readonly<Record<KpiStatus | "notConfigured", string>> = {
  critical: "Critical",
  warning: "Warning",
  good: "Good",
  excellent: "Excellent",
  outstanding: "Outstanding",
  notConfigured: "Chưa cấu hình",
};

export const KPI_STATUS_BADGE_VARIANT: Readonly<
  Record<
    KpiStatus | "notConfigured",
    "danger" | "warning" | "info" | "success" | "outstanding" | "neutral"
  >
> = {
  critical: "danger",
  warning: "warning",
  good: "info",
  excellent: "success",
  outstanding: "outstanding",
  notConfigured: "neutral",
};

export const FORECAST_STATUS_LABELS: Readonly<Record<ForecastStatus, string>> = {
  achievable: "Khả thi",
  needsAttention: "Cần chú ý",
  highRisk: "Rủi ro cao",
  critical: "Nguy cấp",
};

export const FORECAST_STATUS_COLORS: Readonly<Record<ForecastStatus, string>> = {
  achievable: "var(--color-success)",
  needsAttention: "var(--color-warning)",
  highRisk: "var(--color-danger)",
  critical: "#dc2626",
};
