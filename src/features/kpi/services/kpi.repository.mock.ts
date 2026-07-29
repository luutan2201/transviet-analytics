import type { KpiRepository, KpiQueryParams } from "@/features/kpi/services/kpi.repository";
import type { Result } from "@/types/result";
import { ok } from "@/types/result";
import { kpiApiResponseSchema, type KpiApiResponse } from "@/features/kpi/types/kpi-api.schema";

/** Reasonable sample monthly targets — roughly 15% above a typical month's mock performance. */
const SAMPLE_TARGETS: Record<string, number> = {
  reach: 45000,
  impressions: 150000,
  followers: 9500,
  reactions: 1600,
  comments: 220,
  shares: 130,
  clicks: 700,
  videoViews: 20000,
};

export class MockKpiRepository implements KpiRepository {
  async getKpiTargets(params: KpiQueryParams): Promise<Result<KpiApiResponse>> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const now = new Date();
    const rawResponse = {
      success: true as const,
      message: "",
      version: "1.0.0-mock",
      updatedAt: now.toISOString(),
      data: {
        year: params.year,
        month: now.getMonth() + 1,
        metrics: Object.entries(SAMPLE_TARGETS).map(([metric, target]) => ({
          metric,
          target,
          periodType: "month" as const,
          month: now.getMonth() + 1,
          quarter: null,
          year: params.year,
          enabled: true,
        })),
      },
    };

    const parsed = kpiApiResponseSchema.parse(rawResponse);
    return ok(parsed);
  }
}
