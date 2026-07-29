"use client";

import { useState } from "react";
import { Copy, Check, RotateCw, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settings.store";
import { useToast } from "@/hooks/use-toast";
import type { ReportType } from "@/features/report/types/report.types";

interface ReportActionsProps {
  readonly markdown: string;
  readonly periodLabel: string;
  readonly reportType: ReportType;
  readonly generatedAt: string;
  readonly onRegenerate: () => void;
  readonly isRegenerating: boolean;
}

const REPORT_TYPE_TITLE: Record<ReportType, string> = {
  weekly: "Báo cáo tuần",
  monthly: "Báo cáo tháng",
  quarterly: "Báo cáo quý",
  yearly: "Báo cáo năm",
};

export function ReportActions({
  markdown,
  periodLabel,
  reportType,
  generatedAt,
  onRegenerate,
  isRegenerating,
}: ReportActionsProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const settings = useSettingsStore((s) => s.settings);
  const { toast } = useToast();

  async function handleCopy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleExportPdf() {
    setExporting(true);
    try {
      // @react-pdf/renderer is ~400kB — load it only when the user actually exports,
      // per 03_Technical_Architecture.md PERFORMANCE ("Dynamic import heavy components").
      const [{ downloadPdf }, { ReportPdfDocument }] = await Promise.all([
        import("@/lib/export/pdf/download-pdf"),
        import("@/lib/export/pdf/report-pdf-document"),
      ]);

      await downloadPdf(
        <ReportPdfDocument
          markdown={markdown}
          title={REPORT_TYPE_TITLE[reportType]}
          periodLabel={periodLabel}
          brandColor={settings.brandColor}
          logoDataUrl={settings.logoDataUrl}
          generatedAt={generatedAt}
        />,
        REPORT_TYPE_TITLE[reportType]
      );
    } catch {
      toast({ title: "Không thể xuất PDF", variant: "error" });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" className="gap-2" onClick={handleCopy}>
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Đã sao chép" : "Sao chép"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={onRegenerate}
        loading={isRegenerating}
      >
        <RotateCw className="size-4" />
        Tạo lại
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleExportPdf}
        disabled={exporting}
      >
        {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
        Export PDF
      </Button>
    </div>
  );
}
