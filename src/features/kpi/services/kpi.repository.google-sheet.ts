import type { KpiRepository, KpiQueryParams } from "@/features/kpi/services/kpi.repository";
import type { Result } from "@/types/result";
import { ok, err } from "@/types/result";
import { kpiApiResponseSchema, type KpiApiResponse } from "@/features/kpi/types/kpi-api.schema";
import { apiErrorResponseSchema } from "@/features/dashboard/types/dashboard-api.schema";
import { fetchWithRetry } from "@/lib/fetch-with-retry";

export class GoogleSheetKpiRepository implements KpiRepository {
  constructor(private readonly appsScriptUrl: string) {}

  async getKpiTargets(params: KpiQueryParams): Promise<Result<KpiApiResponse>> {
    try {
      const url = new URL(this.appsScriptUrl);
      url.searchParams.set("action", "kpi");
      url.searchParams.set("year", String(params.year));

      const response = await fetchWithRetry(url.toString(), { method: "GET" });
      const json: unknown = await response.json();

      const errorParsed = apiErrorResponseSchema.safeParse(json);
      if (errorParsed.success) {
        return err(errorParsed.data.errorCode, errorParsed.data.message);
      }

      const parsed = kpiApiResponseSchema.safeParse(json);
      if (!parsed.success) {
        return err("INVALID_SCHEMA", "Dữ liệu KPI trả về không đúng định dạng.");
      }

      return ok(parsed.data);
    } catch {
      return err("SYNC_FAILED", "Không thể tải cấu hình KPI từ Google Sheet.");
    }
  }
}
