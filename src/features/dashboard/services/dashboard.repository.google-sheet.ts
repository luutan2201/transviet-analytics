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

export class GoogleSheetDashboardRepository implements DashboardRepository {
  constructor(private readonly appsScriptUrl: string) {}

  async getDashboard(params: DashboardQueryParams): Promise<Result<DashboardApiResponse>> {
    try {
      // Manual sync bypasses cache per 05_GG_Sheet_Data_Structure.md SYNC WORKFLOW —
      // trigger the sync action first so Apps Script re-reads the sheet before we fetch.
      // NOTE: no custom headers/JSON body here on purpose — Apps Script Web Apps cannot
      // respond to CORS preflight (OPTIONS) requests, so this must stay a "simple request"
      // (no Content-Type header, no body) to avoid the browser blocking it.
      if (params.force) {
        const syncUrl = new URL(this.appsScriptUrl);
        syncUrl.searchParams.set("action", "sync");
        syncUrl.searchParams.set("force", "true");
        await fetchWithRetry(syncUrl.toString(), { method: "POST" }).catch(
          () => null // If sync itself fails, we still attempt the regular (cached) read below.
        );
      }

      const url = new URL(this.appsScriptUrl);
      url.searchParams.set("action", "dashboard");
      url.searchParams.set("year", String(params.year));

      const response = await fetchWithRetry(url.toString(), { method: "GET" });
      const json: unknown = await response.json();

      const errorParsed = apiErrorResponseSchema.safeParse(json);
      if (errorParsed.success) {
        return err(errorParsed.data.errorCode, errorParsed.data.message);
      }

      const parsed = apiBaseResponseSchema.safeParse(json);
      if (!parsed.success) {
        return err("INVALID_SCHEMA", "Dữ liệu trả về từ Apps Script không đúng định dạng.");
      }

      return ok(parsed.data);
    } catch {
      return err(
        "SYNC_FAILED",
        "Không thể kết nối tới Google Sheet. Vui lòng kiểm tra lại Apps Script URL hoặc thử lại sau."
      );
    }
  }
}
