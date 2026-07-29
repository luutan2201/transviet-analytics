import { ReportContent } from "@/features/report/components/report-content";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "AI Report" };

export default function ReportPage() {
  return <ReportContent />;
}
