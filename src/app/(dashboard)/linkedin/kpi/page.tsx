import type { Metadata } from "next";
import { LinkedInKpiContent } from "@/features/linkedin/components/linkedin-kpi-content";

export const metadata: Metadata = { title: "LinkedIn KPI" };

export default function LinkedInKpiPage() {
  return <LinkedInKpiContent />;
}
