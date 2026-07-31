"use client";

import { FileSpreadsheet, FileText, Printer, Download } from "lucide-react";
import Link from "next/link";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { usePeriodMetrics } from "@/features/dashboard/hooks/use-period-metrics";
import { useKpiData } from "@/features/kpi/hooks/use-kpi-data";
import { PageHeader } from "@/components/shared/layout-primitives";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import { KPI_STATUS_LABELS } from "@/features/kpi/config/kpi-status-labels";
import { exportToExcel } from "@/lib/export/excel-export";
import { calculateEngagementRate } from "@/features/dashboard/utils/engagement";
import { ROUTES } from "@/config/routes";

interface ExportOptionProps {
  readonly icon: React.ElementType;
  readonly title: string;
  readonly description: string;
  readonly actionLabel: string;
  readonly onAction?: () => void;
  readonly href?: string;
  readonly disabled?: boolean;
}

function ExportOption({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  href,
  disabled,
}: ExportOptionProps) {
  return (
    <GlassCard className="flex flex-col gap-4 p-6">
      <div className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--primary)_16%,transparent)]">
        <Icon className="size-5 text-[var(--primary)]" />
      </div>
      <div>
        <p className="font-medium text-[var(--foreground)]">{title}</p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
      </div>
      {href ? (
        <Button asChild variant="outline" size="sm" className="w-fit gap-2">
          <Link href={href}>{actionLabel}</Link>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-fit gap-2"
          onClick={onAction}
          disabled={disabled}
        >
          <Download className="size-4" />
          {actionLabel}
        </Button>
      )}
    </GlassCard>
  );
}

export function ExportContent() {
  const { data: dashboard, isLoading } = useDashboard();
  const periodMetrics = usePeriodMetrics(dashboard);
  const { kpiModels } = useKpiData(periodMetrics?.current, periodMetrics?.previous);

  const hasData = !isLoading && !!dashboard && !!periodMetrics;

  function handleExportWeekly() {
    if (!periodMetrics) return;
    exportToExcel("weekly-data", [
      {
        name: "Weekly Data",
        rows: periodMetrics.points.map((row) => ({
          Tuần: row.week,
          Tháng: row.month,
          Quý: row.quarter,
          Năm: row.year,
          Reach: row.reach,
          Impressions: row.impressions,
          Followers: row.followers,
          Reactions: row.reactions,
          Comments: row.comments,
          Shares: row.shares,
          Clicks: row.clicks,
          "Video Views": row.videoViews,
          "Engagement Rate (%)": Number(calculateEngagementRate(row).toFixed(2)),
        })),
      },
    ]);
  }

  function handleExportKpi() {
    if (!kpiModels) return;
    exportToExcel("kpi-report", [
      {
        name: "KPI",
        rows: kpiModels.map((k) => ({
          "Chỉ số": METRIC_LABELS[k.metric],
          "Hiện tại": k.current,
          "Mục tiêu": k.target ?? "",
          "Hoàn thành (%)": k.completion !== null ? Number(k.completion.toFixed(1)) : "",
          "Trạng thái": KPI_STATUS_LABELS[k.status],
        })),
      },
    ]);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Export" subtitle="Xuất báo cáo dạng PDF, Excel, PNG" />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-[var(--radius-card)]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ExportOption
            icon={FileSpreadsheet}
            title="Dữ liệu tuần"
            description="Xuất toàn bộ dữ liệu tuần đang hiển thị ra file Excel."
            actionLabel="Export Excel"
            onAction={handleExportWeekly}
            disabled={!hasData}
          />
          <ExportOption
            icon={FileSpreadsheet}
            title="Báo cáo KPI"
            description="Xuất bảng KPI (mục tiêu, hoàn thành, trạng thái) ra Excel."
            actionLabel="Export Excel"
            onAction={handleExportKpi}
            disabled={!kpiModels}
          />
          <ExportOption
            icon={FileText}
            title="AI Report (PDF)"
            description="Tạo và xuất báo cáo điều hành dạng PDF từ trang AI Report."
            actionLabel="Đi tới AI Report"
            href={ROUTES.report}
          />
          <ExportOption
            icon={Printer}
            title="In trang hiện tại"
            description="Mở hộp thoại in của trình duyệt cho trang bạn đang xem."
            actionLabel="In trang"
            onAction={() => window.print()}
          />
        </div>
      )}
    </div>
  );
}
