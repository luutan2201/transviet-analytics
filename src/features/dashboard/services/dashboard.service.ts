import { MockDashboardRepository } from "@/features/dashboard/services/dashboard.repository.mock";
import { GoogleSheetDashboardRepository } from "@/features/dashboard/services/dashboard.repository.google-sheet";
import type {
  DashboardRepository,
  DashboardQueryParams,
} from "@/features/dashboard/services/dashboard.repository";
import { transformDashboardResponse } from "@/features/dashboard/utils/dashboard.transformer";
import type { DashboardModel } from "@/features/dashboard/types/dashboard.model";
import { env } from "@/config/env";
import { resolveAppsScriptUrl } from "@/features/settings/utils/resolve-apps-script-url";

const mockRepository = new MockDashboardRepository();

function resolveDashboardRepository(): DashboardRepository {
  const url = resolveAppsScriptUrl(env.NEXT_PUBLIC_APPS_SCRIPT_URL);
  if (url) return new GoogleSheetDashboardRepository(url);
  // No Apps Script URL configured yet — fall back to realistic mock data so the
  // product remains fully usable/demoable before a real sheet is connected.
  return mockRepository;
}

export interface DashboardServiceError {
  readonly code: string;
  readonly message: string;
}

export async function fetchDashboard(
  params: DashboardQueryParams
): Promise<{ ok: true; data: DashboardModel } | { ok: false; error: DashboardServiceError }> {
  const result = await resolveDashboardRepository().getDashboard(params);

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return { ok: true, data: transformDashboardResponse(result.data) };
}
