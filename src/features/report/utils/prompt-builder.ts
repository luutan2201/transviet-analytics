import { REPORT_LENGTH_RANGE, type ReportContext } from "@/features/report/types/report.types";

const SYSTEM_PROMPT = `Bạn là một Marketing Analyst giàu kinh nghiệm, viết báo cáo hiệu suất Facebook Marketing bằng tiếng Việt.
Giọng văn chuyên nghiệp, dễ hiểu cho ban điều hành. Không dùng ngôn ngữ marketing sáo rỗng, không emoji, không phóng đại.
Luôn giải thích ý nghĩa của số liệu, không chỉ liệt kê lại.`;

/**
 * Builds the full prompt sent to an AI provider. Never call this from a component —
 * only from the report service, per 06_Report_engine.md AI PROMPT TEMPLATE.
 */
export function buildReportPrompt(context: ReportContext): string {
  const lengthRange = REPORT_LENGTH_RANGE[context.reportType];

  const metricsBlock = context.metrics
    .map(
      (m) =>
        `- ${m.metric}: hiện tại ${m.current.toLocaleString("vi-VN")}, kỳ trước ${m.previous.toLocaleString("vi-VN")}, tăng trưởng ${m.growthPercent.toFixed(1)}%`
    )
    .join("\n");

  const kpiBlock =
    context.kpis.length > 0
      ? context.kpis
          .map(
            (k) =>
              `- ${k.metric}: mục tiêu ${k.target?.toLocaleString("vi-VN") ?? "chưa cấu hình"}, hoàn thành ${k.completion !== null ? k.completion.toFixed(1) + "%" : "—"}, trạng thái ${k.status}`
          )
          .join("\n")
      : "Chưa có KPI nào được cấu hình cho kỳ này.";

  const positiveBlock =
    context.topPositiveInsights.length > 0
      ? context.topPositiveInsights.map((i) => `- ${i}`).join("\n")
      : "Không có điểm nổi bật đặc biệt.";

  const negativeBlock =
    context.topNegativeInsights.length > 0
      ? context.topNegativeInsights.map((i) => `- ${i}`).join("\n")
      : "Không có vấn đề đáng lo ngại.";

  return `${SYSTEM_PROMPT}

# Bối cảnh
Kỳ báo cáo: ${context.periodLabel} (${context.year})
Loại báo cáo: ${context.reportType}
Độ dài mục tiêu: ${lengthRange.min}-${lengthRange.max} từ.

# Chỉ số hiệu suất
${metricsBlock}

# KPI
${kpiBlock}

# Điểm tích cực
${positiveBlock}

# Điểm cần lưu ý
${negativeBlock}

# Yêu cầu định dạng đầu ra
Trả về Markdown với CHÍNH XÁC các heading cấp 2 sau, theo đúng thứ tự:
## Tóm tắt điều hành
## Tổng quan hiệu suất
## Phân tích KPI
## Phân tích tăng trưởng
## Điểm tích cực
## Điểm cần lưu ý
## Khuyến nghị
## Kết luận

Phần "Tóm tắt điều hành" tối đa 150 từ. Không thêm heading nào khác ngoài danh sách trên.`;
}
