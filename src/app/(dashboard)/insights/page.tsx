import { Lightbulb } from "lucide-react";
import { ComingSoonPage } from "@/components/shared/coming-soon-page";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Insights" };

export default function InsightsPage() {
  return (
    <ComingSoonPage
      title="Insights"
      subtitle="Những phát hiện quan trọng được tạo tự động."
      icon={Lightbulb}
    />
  );
}
