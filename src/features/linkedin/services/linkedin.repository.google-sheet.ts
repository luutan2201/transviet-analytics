import type {
  DashboardRepository,
  DashboardQueryParams,
} from "@/features/dashboard/services/dashboard.repository";
import type { Result } from "@/types/result";
import { ok, err } from "@/types/result";
import {
  apiBaseResponseSchema,
  apiErrorResponseSchema,
  type DashboardApiResponse,
} from "@/features/dashboard/types/dashboard-api.schema";
import { fetchWithRetry } from "@/lib/fetch-with-retry";

export class GoogleSheetLinkedInRepository implements DashboardRepository {
  constructor(private readonly appsScriptUrl: string) {}

  async getDashboard(params: DashboardQueryParams): Promise<Result<DashboardApiResponse>> {
    try {
      if (params.force) {
        const syncUrl = new URL(this.appsScriptUrl);
        syncUrl.searchParams.set("action", "sync");
        syncUrl.searchParams.set("force", "true");
        await fetchWithRetry(syncUrl.toString(), { method: "POST" }).catch(() => null);
      }

      const url = new URL(this.appsScriptUrl);
      url.searchParams.set("action", "linkedin");
      url.searchParams.set("year", String(params.year));

      const response = await fetchWithRetry(url.toString(), { method: "GET" });
      const json: unknown = await response.json();

      const errorParsed = apiErrorResponseSchema.safeParse(json);
      if (errorParsed.success) {
        return err(errorParsed.data.errorCode, errorParsed.data.message);
      }

      const parsed = apiBaseResponseSchema.safeParse(json);
      if (!parsed.success) {
        return err("INVALID_SCHEMA", "Dữ liệu LinkedIn trả về không đúng định dạng.");
      }

      return ok(parsed.data);
    } catch {
      return err("SYNC_FAILED", "Không thể kết nối tới dữ liệu LinkedIn.");
    }
  }
}
