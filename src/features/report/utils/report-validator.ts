import {
  REPORT_REQUIRED_SECTIONS,
  REPORT_LENGTH_RANGE,
  type ReportType,
} from "@/features/report/types/report.types";

export interface ReportValidationResult {
  readonly valid: boolean;
  readonly missingSections: readonly string[];
  readonly wordCount: number;
  readonly reason?: string;
}

export function validateReportMarkdown(
  markdown: string,
  reportType: ReportType
): ReportValidationResult {
  if (!markdown || markdown.trim().length === 0) {
    return { valid: false, missingSections: [], wordCount: 0, reason: "Phản hồi rỗng." };
  }

  const missingSections = REPORT_REQUIRED_SECTIONS.filter(
    (section) => !markdown.includes(`## ${section}`)
  );

  const wordCount = markdown.trim().split(/\s+/).length;
  const minAllowed = Math.round(REPORT_LENGTH_RANGE[reportType].min * 0.5);

  if (missingSections.length > 0) {
    return {
      valid: false,
      missingSections,
      wordCount,
      reason: `Thiếu các phần: ${missingSections.join(", ")}.`,
    };
  }

  if (wordCount < minAllowed) {
    return {
      valid: false,
      missingSections: [],
      wordCount,
      reason: "Nội dung quá ngắn so với yêu cầu.",
    };
  }

  return { valid: true, missingSections: [], wordCount };
}
