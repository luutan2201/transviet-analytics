"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import { useLinkedInDashboard } from "@/features/linkedin/hooks/use-linkedin-dashboard";
import { usePeriodMetrics } from "@/features/dashboard/hooks/use-period-metrics";
import { useKpiData } from "@/features/kpi/hooks/use-kpi-data";
import { PageHeader } from "@/components/shared/layout-primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { KpiOverviewCard } from "@/features/kpi/components/kpi-overview-card";
import { KpiTable } from "@/features/kpi/components/kpi-table";
import { SetKpiTargetDialog } from "@/features/kpi/components/set-kpi-target-dialog";
import { KpiTargetsList } from "@/features/kpi/components/kpi-targets-list";
import type { KpiModel } from "@/features/kpi/types/kpi.model";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import { KPI_STATUS_LABELS } from "@/features/kpi/config/kpi-status-labels";
import { exportToExcel } from "@/lib/export/excel-export";
import { LINKEDIN_METRICS } from "@/features/linkedin/config/linkedin-metrics";

const KpiForecastChart = dynamic(
  () => import("@/features/kpi/components/kpi-forecast-chart").then((m) => m.KpiForecastChart),
  { loading: () => <Skeleton className="h-80 rounded-[var(--radius-card)]" />, ssr: false }
);

const KpiStatusDistribution = dynamic(
  () =>
    import("@/features/kpi/components/kpi-status-distribution").then(
      (m) => m.KpiStatusDistribution
    ),
  { loading: () => <Skeleton className="h-80 rounded-[var(--radius-card)]" />, ssr: false }
);

const KpiDetailDrawer = dynamic(
  () => import("@/features/kpi/components/kpi-detail-drawer").then((m) => m.KpiDetailDrawer),
  { ssr: false }
);

function exportKpiToExcel(kpis: readonly KpiModel[]) {
  exportToExcel("linkedin-kpi-report", [
    {
      name: "LinkedIn KPI",
      rows: kpis.map((k) => ({
        "Chỉ số": METRIC_LABELS[k.metric],
        "Hiện tại": k.current,
        "Mục tiêu": k.target ?? "",
        "Hoàn thành (%)": k.completion !== null ? Number(k.completion.toFixed(1)) : "",
        "Còn lại": k.remaining ?? "",
        "Dự báo": k.forecast ?? "",
        "Trạng thái": KPI_STATUS_LABELS[k.status],
      })),
    },
  ]);
}

export function LinkedInKpiContent() {
  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError,
    refetch,
  } = useLinkedInDashboard();
  const periodMetrics = usePeriodMetrics(dashboard);
  const { kpiModels, isLoading: isKpiLoading } = useKpiData(
    periodMetrics?.current,
    periodMetrics?.previous,
    { platform: "linkedin", metrics: LINKEDIN_METRICS }
  );
  const [selectedKpi, setSelectedKpi] = useState<KpiModel | null>(null);

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const isLoading = isDashboardLoading || isKpiLoading || !kpiModels || !periodMetrics;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="LinkedIn KPI"
        subtitle="Theo dõi tiến độ so với mục tiêu kinh doanh trên LinkedIn"
        actions={
          <div className="flex items-center gap-2">
            <SetKpiTargetDialog platform="linkedin" metrics={LINKEDIN_METRICS} />
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isLoading}
              onClick={() => kpiModels && exportKpiToExcel(kpiModels)}
            >
              <Download className="size-4" />
              Export Excel
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-[var(--radius-card)]" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpiModels.map((kpi) => (
              <KpiOverviewCard key={kpi.metric} kpi={kpi} onClick={() => setSelectedKpi(kpi)} />
            ))}
          </div>

          <KpiTargetsList platform="linkedin" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <KpiForecastChart kpis={kpiModels} />
            </div>
            <KpiStatusDistribution kpis={kpiModels} />
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-[var(--foreground)]">
              Bảng chi tiết KPI
            </h3>
            <KpiTable data={kpiModels} />
          </div>

          <KpiDetailDrawer
            kpi={selectedKpi}
            points={periodMetrics.points}
            onClose={() => setSelectedKpi(null)}
          />
        </>
      )}
    </div>
  );
}
