import { TrendingUp } from "lucide-react";
import { ComingSoonPage } from "@/components/shared/coming-soon-page";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Performance" };

export default function PerformancePage() {
  return (
    <ComingSoonPage
      title="Performance"
      subtitle="Biểu đồ hiệu suất theo thời gian."
      icon={TrendingUp}
    />
  );
}
