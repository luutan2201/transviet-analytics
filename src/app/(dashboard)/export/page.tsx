import { ExportContent } from "@/features/export/components/export-content";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Export" };

export default function ExportPage() {
  return <ExportContent />;
}
