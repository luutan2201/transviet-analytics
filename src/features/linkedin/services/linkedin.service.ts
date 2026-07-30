import { MockLinkedInRepository } from "@/features/linkedin/services/linkedin.repository.mock";
import { GoogleSheetLinkedInRepository } from "@/features/linkedin/services/linkedin.repository.google-sheet";
import type {
  DashboardRepository,
  DashboardQueryParams,
} from "@/features/dashboard/services/dashboard.repository";
import { transformLinkedInResponse } from "@/features/linkedin/utils/linkedin.transformer";
import type { DashboardModel } from "@/features/dashboard/types/dashboard.model";
import { env } from "@/config/env";
import { resolveAppsScriptUrl } from "@/features/settings/utils/resolve-apps-script-url";

const mockRepository = new MockLinkedInRepository();

function resolveLinkedInRepository(): DashboardRepository {
  const url = resolveAppsScriptUrl(env.NEXT_PUBLIC_APPS_SCRIPT_URL);
  if (url) return new GoogleSheetLinkedInRepository(url);
  return mockRepository;
}

export interface LinkedInServiceError {
  readonly code: string;
  readonly message: string;
}

export async function fetchLinkedInDashboard(
  params: DashboardQueryParams
): Promise<{ ok: true; data: DashboardModel } | { ok: false; error: LinkedInServiceError }> {
  const result = await resolveLinkedInRepository().getDashboard(params);

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return { ok: true, data: transformLinkedInResponse(result.data) };
}
