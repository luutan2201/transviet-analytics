import { MockKpiRepository } from "@/features/kpi/services/kpi.repository.mock";
import { GoogleSheetKpiRepository } from "@/features/kpi/services/kpi.repository.google-sheet";
import type { KpiRepository, KpiQueryParams } from "@/features/kpi/services/kpi.repository";
import type { KpiTargetRaw } from "@/features/kpi/types/kpi-api.schema";
import { env } from "@/config/env";
import { resolveAppsScriptUrl } from "@/features/settings/utils/resolve-apps-script-url";

const mockRepository = new MockKpiRepository();

function resolveKpiRepository(): KpiRepository {
  const url = resolveAppsScriptUrl(env.NEXT_PUBLIC_APPS_SCRIPT_URL);
  if (url) return new GoogleSheetKpiRepository(url);
  return mockRepository;
}

export interface KpiServiceError {
  readonly code: string;
  readonly message: string;
}

export async function fetchKpiTargets(
  params: KpiQueryParams
): Promise<{ ok: true; data: readonly KpiTargetRaw[] } | { ok: false; error: KpiServiceError }> {
  const result = await resolveKpiRepository().getKpiTargets(params);

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return { ok: true, data: result.data.data.metrics };
}
