import type { ReportContext } from "@/features/report/types/report.types";

function formatNumber(value: number): string {
  return value.toLocaleString("vi-VN");
}

export function generateFallbackReport(context: ReportContext): string {
  const growingMetrics = context.metrics.filter((m) => m.growthPercent > 0);
  const decliningMetrics = context.metrics.filter((m) => m.growthPercent < 0);
  const bestMetric = [...context.metrics].sort((a, b) => b.growthPercent - a.growthPercent)[0];
  const worstMetric = [...context.metrics].sort((a, b) => a.growthPercent - b.growthPercent)[0];

  const executiveSummary = `Trong ${context.periodLabel} (${context.year}), hiệu suất tổng thể ${
    growingMetrics.length >= decliningMetrics.length
      ? "duy trì xu hướng tích cực"
      : "có dấu hiệu chững lại"
  } với ${growingMetrics.length}/${context.metrics.length} chỉ số tăng trưởng so với kỳ trước. ${
    bestMetric
      ? `${bestMetric.metric} dẫn đầu đà tăng trưởng với ${bestMetric.growthPercent.toFixed(1)}%.`
      : ""
  } ${
    context.kpis.length > 0
      ? "Tiến độ KPI được theo dõi chi tiết ở phần dưới."
      : "Hiện chưa có mục tiêu KPI nào được cấu hình cho kỳ này."
  }`.trim();

  const performanceOverview = context.metrics
    .map(
      (m) =>
        `- **${m.metric}**: ${formatNumber(m.current)} (${m.growthPercent >= 0 ? "+" : ""}${m.growthPercent.toFixed(1)}% so với kỳ trước, kỳ trước đạt ${formatNumber(m.previous)}).`
    )
    .join("\n");

  const kpiAnalysis =
    context.kpis.length > 0
      ? context.kpis
          .map(
            (k) =>
              `- **${k.metric}**: ${k.target !== null ? `mục tiêu ${formatNumber(k.target)}, hoàn thành ${k.completion?.toFixed(1)}%, trạng thái ${k.status}.` : "chưa cấu hình mục tiêu."}`
          )
          .join("\n")
      : "Chưa có KPI nào được cấu hình cho kỳ báo cáo này. Đề xuất thiết lập mục tiêu trong Google Sheet KPI để theo dõi tiến độ chính xác hơn.";

  const growthAnalysis = `${
    bestMetric
      ? `${bestMetric.metric} là chỉ số tăng trưởng mạnh nhất (${bestMetric.growthPercent.toFixed(1)}%), cho thấy nội dung hoặc chiến dịch liên quan đang hoạt động hiệu quả.`
      : ""
  } ${
    worstMetric && worstMetric.growthPercent < 0
      ? `Ngược lại, ${worstMetric.metric} giảm ${Math.abs(worstMetric.growthPercent).toFixed(1)}%, cần được xem xét kỹ hơn trong phần khuyến nghị.`
      : "Không có chỉ số nào suy giảm đáng kể trong kỳ này."
  }`.trim();

  const positiveFindings =
    context.topPositiveInsights.length > 0
      ? context.topPositiveInsights.map((i) => `- ${i}`).join("\n")
      : "- Hiệu suất ổn định, không có điểm nổi bật đặc biệt trong kỳ này.";

  const negativeFindings =
    context.topNegativeInsights.length > 0
      ? context.topNegativeInsights.map((i) => `- ${i}`).join("\n")
      : "- Không phát hiện vấn đề đáng lo ngại trong kỳ này.";

  const recommendations = [
    decliningMetrics.length > 0
      ? `Ưu tiên xem xét lại chiến lược nội dung cho ${decliningMetrics.map((m) => m.metric).join(", ")}.`
      : "Duy trì chiến lược nội dung hiện tại, tiếp tục theo dõi các chỉ số hàng tuần.",
    context.kpis.some((k) => k.target === null)
      ? "Thiết lập mục tiêu KPI đầy đủ cho tất cả các chỉ số để theo dõi tiến độ chính xác hơn."
      : "Rà soát lại các mục tiêu KPI đã đạt để chuẩn bị mục tiêu cho kỳ tiếp theo.",
    "Tiếp tục theo dõi Insight tự động để phát hiện sớm các biến động bất thường.",
  ]
    .map((r) => `- ${r}`)
    .join("\n");

  const conclusion = `Nhìn chung, ${context.periodLabel} ghi nhận ${
    growingMetrics.length >= decliningMetrics.length
      ? "kết quả tích cực"
      : "một số thách thức cần điều chỉnh"
  }. Đội ngũ marketing nên tiếp tục theo dõi sát các chỉ số và áp dụng các khuyến nghị ở trên trong kỳ tiếp theo.`;

  return `## Tóm tắt điều hành
${executiveSummary}

## Tổng quan hiệu suất
${performanceOverview}

## Phân tích KPI
${kpiAnalysis}

## Phân tích tăng trưởng
${growthAnalysis}

## Điểm tích cực
${positiveFindings}

## Điểm cần lưu ý
${negativeFindings}

## Khuyến nghị
${recommendations}

## Kết luận
${conclusion}
`;
}
