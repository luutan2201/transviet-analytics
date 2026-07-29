import type { KpiStatus } from "@/config/kpi";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import type { KpiMetric } from "@/config/kpi";

const RECOMMENDATIONS: Readonly<Record<KpiStatus, (label: string) => string>> = {
  critical: (label) =>
    `Tăng cường tần suất chiến dịch cho ${label}, xem xét lại chiến lược nội dung.`,
  warning: (label) => `Đẩy mạnh nội dung hiệu quả cho ${label} và theo dõi sát trong tuần tới.`,
  good: (label) => `Duy trì đà tăng trưởng hiện tại của ${label}, theo dõi mức độ tương tác.`,
  excellent: (label) => `${label} đang đạt tốt. Chuẩn bị KPI cho kỳ tiếp theo.`,
  outstanding: (label) => `Vượt mục tiêu ${label}. Ghi nhận chiến lược hiệu quả để nhân rộng.`,
};

export function generateKpiRecommendation(metric: KpiMetric, status: KpiStatus): string {
  return RECOMMENDATIONS[status](METRIC_LABELS[metric]);
}
