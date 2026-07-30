import type { Metadata } from "next";
import { LinkedInReportContent } from "@/features/linkedin/components/linkedin-report-content";

export const metadata: Metadata = { title: "LinkedIn AI Report" };

export default function LinkedInReportPage() {
  return <LinkedInReportContent />;
}
