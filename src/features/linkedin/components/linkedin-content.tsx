"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useLinkedInDashboard } from "@/features/linkedin/hooks/use-linkedin-dashboard";
import { usePeriodMetrics } from "@/features/dashboard/hooks/use-period-metrics";
import { useFilterStore } from "@/stores/filter.store";
import { LinkedInHero } from "@/features/linkedin/components/linkedin-hero";
import { FilterBar } from "@/features/dashboard/components/filter-bar";
import { KpiGrid } from "@/features/dashboard/components/kpi-grid";
import { ComparisonSection } from "@/features/dashboard/components/comparison-section";
import { InsightSection } from "@/features/dashboard/components/insight-section";
import { DashboardFooter } from "@/features/dashboard/components/dashboard-footer";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { KpiMetric } from "@/config/kpi";
import { LINKEDIN_METRICS } from "@/features/linkedin/config/linkedin-metrics";

const MonthlyComparisonSection = dynamic(
  () =>
    import("@/features/dashboard/components/monthly-comparison-section").then(
      (m) => m.MonthlyComparisonSection
    ),
  { loading: () => <Skeleton className="h-96 rounded-[var(--radius-card)]" />, ssr: false }
);

const LinkedInDataTable = dynamic(
  () =>
    import("@/features/linkedin/components/linkedin-data-table").then((m) => m.LinkedInDataTable),
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
  month: "tháng trước",
  quarter: "quý trước",
  year: "năm trước",
};

export function LinkedInContent() {
  const { data, isLoading, isError, refetch } = useLinkedInDashboard();
  const period = useFilterStore((s) => s.period);
  const setPeriod = useFilterStore((s) => s.setPeriod);
  const periodMetrics = usePeriodMetrics(data);
  const [selectedMetric, setSelectedMetric] = useState<KpiMetric | null>(null);

  // LinkedIn has no weekly granularity — if the shared filter is set to "week"
  // (e.g. left over from viewing the Facebook dashboard), fall back to month.
  useEffect(() => {
    if (period === "week") setPeriod("month");
  }, [period, setPeriod]);

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (isLoading || !data || !periodMetrics || period === "week") {
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

  return (
    <div className="flex flex-col gap-8">
      <LinkedInHero lastSync={data.lastSync} />
      <FilterBar periods={["month", "quarter", "year"]} />
      <KpiGrid
        current={periodMetrics.current}
        previous={periodMetrics.previous}
        points={periodMetrics.points}
        onSelectMetric={setSelectedMetric}
        metrics={LINKEDIN_METRICS}
        showEngagementRate
      />
      <MonthlyComparisonSection monthly={data.monthly} metrics={LINKEDIN_METRICS} />
      <ComparisonSection
        current={periodMetrics.current}
        previous={periodMetrics.previous}
        periodLabel={PERIOD_LABELS[period] ?? "kỳ trước"}
        metrics={LINKEDIN_METRICS.slice(0, 4)}
      />
      <InsightSection
        current={periodMetrics.current}
        previous={periodMetrics.previous}
        metrics={LINKEDIN_METRICS}
      />
      <LinkedInDataTable data={data.monthly} />
      <DashboardFooter lastSync={data.lastSync} />

      <MetricDetailDrawer
        metric={selectedMetric}
        points={periodMetrics.points}
        onClose={() => setSelectedMetric(null)}
      />
    </div>
  );
}
