import type { ReportContext } from "@/features/report/types/report.types";

interface GenerateReportResponse {
  readonly success: boolean;
  readonly markdown?: string;
  readonly provider?: string;
  readonly message?: string;
}

async function generateReport(context: ReportContext): Promise<GenerateReportResponse> {
  const response = await fetch("/api/report/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context }),
  });
  return (await response.json()) as GenerateReportResponse;
}

export const reportService = { generateReport };
