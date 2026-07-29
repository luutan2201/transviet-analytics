import { DashboardContent } from "@/features/dashboard/components/dashboard-content";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <DashboardContent />;
}
