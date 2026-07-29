import { KpiContent } from "@/features/kpi/components/kpi-content";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "KPI" };

export default function KpiPage() {
  return <KpiContent />;
}
