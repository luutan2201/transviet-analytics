"use client";

import { useState } from "react";
import { Sparkles, FileText, Loader2 } from "lucide-react";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { usePeriodMetrics } from "@/features/dashboard/hooks/use-period-metrics";
import { useKpiData } from "@/features/kpi/hooks/use-kpi-data";
import { useFilterStore } from "@/stores/filter.store";
import { useGenerateReport } from "@/features/report/hooks/use-generate-report";
import { buildReportContext } from "@/features/report/utils/context-builder";
import { MarkdownRenderer } from "@/features/report/components/markdown-renderer";
import { ReportActions } from "@/features/report/components/report-actions";
import { PageHeader } from "@/components/shared/layout-primitives";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import type { ReportType } from "@/features/report/types/report.types";

const REPORT_TYPE_OPTIONS: readonly { value: ReportType; label: string }[] = [
  { value: "weekly", label: "Báo cáo tuần" },
  { value: "monthly", label: "Báo cáo tháng" },
  { value: "quarterly", label: "Báo cáo quý" },
  { value: "yearly", label: "Báo cáo năm" },
];

const PERIOD_LABEL: Record<ReportType, string> = {
  weekly: "tuần này",
  monthly: "tháng này",
  quarterly: "quý này",
  yearly: "năm nay",
};

export function ReportContent() {
  const { data: dashboard, isError, refetch } = useDashboard();
  const periodMetrics = usePeriodMetrics(dashboard);
  const { kpiModels } = useKpiData(periodMetrics?.current, periodMetrics?.previous);
  const year = useFilterStore((s) => s.year);

  const [reportType, setReportType] = useState<ReportType>("monthly");
  const generateReport = useGenerateReport();

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const canGenerate = !!periodMetrics && !!kpiModels;

  function handleGenerate() {
    if (!periodMetrics || !kpiModels) return;
    const context = buildReportContext(
      reportType,
      PERIOD_LABEL[reportType],
      year,
      periodMetrics.current,
      periodMetrics.previous,
      kpiModels
    );
    generateReport.mutate(context);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="AI Report" subtitle="Tạo báo cáo điều hành tự động từ dữ liệu hiện tại" />

      <GlassCard className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <SelectField
            className="w-44"
            options={REPORT_TYPE_OPTIONS}
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
          />
          <span className="text-sm text-[var(--muted-foreground)]">cho {year}</span>
        </div>
        <Button
          size="md"
          className="gap-2"
          disabled={!canGenerate}
          loading={generateReport.isPending}
          onClick={handleGenerate}
        >
          <Sparkles className="size-4" />
          Generate AI Report
        </Button>
      </GlassCard>

      {generateReport.isPending && (
        <GlassCard className="flex flex-col items-center gap-3 p-16 text-center">
          <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
          <p className="text-sm text-[var(--muted-foreground)]">
            Đang phân tích dữ liệu và tạo báo cáo...
          </p>
        </GlassCard>
      )}

      {!generateReport.isPending && !generateReport.latestReport && (
        <EmptyState
          icon={FileText}
          title="Chưa có báo cáo nào"
          description="Chọn loại báo cáo và nhấn Generate AI Report để bắt đầu."
        />
      )}

      {!generateReport.isPending && generateReport.latestReport && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <GlassCard className="p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="primary">
                    {
                      REPORT_TYPE_OPTIONS.find(
                        (o) => o.value === generateReport.latestReport?.reportType
                      )?.label
                    }
                  </Badge>
                  <Badge variant="neutral">{generateReport.latestReport.provider}</Badge>
                </div>
                <ReportActions
                  markdown={generateReport.latestReport.markdown}
                  periodLabel={generateReport.latestReport.periodLabel}
                  reportType={generateReport.latestReport.reportType}
                  generatedAt={generateReport.latestReport.generatedAt}
                  onRegenerate={handleGenerate}
                  isRegenerating={generateReport.isPending}
                />
              </div>
              <MarkdownRenderer markdown={generateReport.latestReport.markdown} />
            </GlassCard>
          </div>

          {generateReport.history.length > 1 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Lịch sử phiên này</h3>
              {generateReport.history.slice(1).map((report) => (
                <GlassCard key={report.id} className="p-4 text-xs text-[var(--muted-foreground)]">
                  <p className="font-medium text-[var(--foreground)]">{report.periodLabel}</p>
                  <p>{new Date(report.generatedAt).toLocaleString("vi-VN")}</p>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
