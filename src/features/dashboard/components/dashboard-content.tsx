"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Camera, Loader2 } from "lucide-react";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { usePeriodMetrics } from "@/features/dashboard/hooks/use-period-metrics";
import { useFilterStore } from "@/stores/filter.store";
import { DashboardHero } from "@/features/dashboard/components/dashboard-hero";
import { FilterBar } from "@/features/dashboard/components/filter-bar";
import { KpiGrid } from "@/features/dashboard/components/kpi-grid";
import { ComparisonSection } from "@/features/dashboard/components/comparison-section";
import { InsightSection } from "@/features/dashboard/components/insight-section";
import { DashboardFooter } from "@/features/dashboard/components/dashboard-footer";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { exportElementAsPng } from "@/lib/export/png-export";
import { useToast } from "@/hooks/use-toast";
import type { KpiMetric } from "@/config/kpi";

// Recharts/TanStack Table are the heaviest dependencies in the bundle — code-split them
// out of the initial dashboard chunk per 03_Technical_Architecture.md PERFORMANCE
// ("Lazy import charts, Dynamic import heavy components") and 25_PERFORMANCE_OPTIMIZATION.md.
const PerformanceSection = dynamic(
  () =>
    import("@/features/dashboard/components/performance-section").then((m) => m.PerformanceSection),
  { loading: () => <Skeleton className="h-96 rounded-[var(--radius-card)]" />, ssr: false }
);

const RadarSection = dynamic(
  () => import("@/features/dashboard/components/radar-section").then((m) => m.RadarSection),
  { loading: () => <Skeleton className="h-96 rounded-[var(--radius-card)]" />, ssr: false }
);

const MonthlyComparisonSection = dynamic(
  () =>
    import("@/features/dashboard/components/monthly-comparison-section").then(
      (m) => m.MonthlyComparisonSection
    ),
  { loading: () => <Skeleton className="h-96 rounded-[var(--radius-card)]" />, ssr: false }
);

const WeeklyDataTable = dynamic(
  () => import("@/features/dashboard/components/weekly-data-table").then((m) => m.WeeklyDataTable),
  { loading: () => <Skeleton className="h-96 rounded-[var(--radius-card)]" />, ssr: false }
);

const MetricDetailDrawer = dynamic(
  () =>
    import("@/features/dashboard/components/metric-detail-drawer").then(
      (m) => m.MetricDetailDrawer
    ),
  { ssr: false }
);

const PERIOD_LABELS: Record<string, string> = {
  week: "tuần trước",
  month: "tháng trước",
  quarter: "quý trước",
  year: "năm trước",
};

export function DashboardContent() {
  const { data, isLoading, isError, refetch } = useDashboard();
  const period = useFilterStore((s) => s.period);
  const periodMetrics = usePeriodMetrics(data);
  const [selectedMetric, setSelectedMetric] = useState<KpiMetric | null>(null);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (isLoading || !data || !periodMetrics) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-24 rounded-[var(--radius-card)]" />
        <Skeleton className="h-16 rounded-[var(--radius-card)]" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-[var(--radius-card)]" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-[var(--radius-card)]" />
      </div>
    );
  }

  async function handleExportPng() {
    if (!contentRef.current) return;
    setIsExportingPng(true);
    try {
      await exportElementAsPng(contentRef.current, "dashboard-snapshot");
      toast({ title: "Đã xuất ảnh dashboard", variant: "success" });
    } catch {
      toast({ title: "Không thể xuất ảnh", variant: "error" });
    } finally {
      setIsExportingPng(false);
    }
  }

  return (
    <div ref={contentRef} className="flex flex-col gap-8">
      <div className="flex items-center justify-end" data-print-hide>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={handleExportPng}
          disabled={isExportingPng}
        >
          {isExportingPng ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Camera className="size-4" />
          )}
          Xuất ảnh PNG
        </Button>
      </div>
      <DashboardHero lastSync={data.lastSync} />
      <FilterBar />
      <KpiGrid
        current={periodMetrics.current}
        previous={periodMetrics.previous}
        points={periodMetrics.points}
        onSelectMetric={setSelectedMetric}
      />
      <PerformanceSection points={periodMetrics.points} />
      <MonthlyComparisonSection monthly={data.monthly} />
      <ComparisonSection
        current={periodMetrics.current}
        previous={periodMetrics.previous}
        periodLabel={PERIOD_LABELS[period] ?? "kỳ trước"}
      />
      <RadarSection current={periodMetrics.current} />
      <InsightSection current={periodMetrics.current} previous={periodMetrics.previous} />
      <WeeklyDataTable data={data.weekly} />
      <DashboardFooter lastSync={data.lastSync} />

      <MetricDetailDrawer
        metric={selectedMetric}
        points={periodMetrics.points}
        onClose={() => setSelectedMetric(null)}
      />
    </div>
  );
}
