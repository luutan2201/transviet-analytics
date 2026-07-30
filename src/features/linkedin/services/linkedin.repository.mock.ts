import type {
  DashboardRepository,
  DashboardQueryParams,
} from "@/features/dashboard/services/dashboard.repository";
import type { Result } from "@/types/result";
import { ok, err } from "@/types/result";
import {
  apiBaseResponseSchema,
  type DashboardApiResponse,
  type WeeklyMetricRaw,
} from "@/features/dashboard/types/dashboard-api.schema";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildMonthlyMockData(year: number): WeeklyMetricRaw[] {
  const random = mulberry32(year * 104729);
  const rows: WeeklyMetricRaw[] = [];
  const now = new Date();
  const monthsSoFar = now.getFullYear() === year ? now.getMonth() + 1 : 12;

  let cumulativeFollowers = 2000 + Math.floor(random() * 500);

  for (let month = 1; month <= monthsSoFar; month += 1) {
    const seasonalBoost = 1 + (month - 1) * 0.02;
    const noise = 0.85 + random() * 0.3;
    const reach = Math.round(6000 * seasonalBoost * noise);

    const newFollowersThisMonth = Math.round(80 + random() * 150);
    cumulativeFollowers += newFollowersThisMonth;

    rows.push({
      week: `M${String(month).padStart(2, "0")}`,
      month,
      quarter: Math.ceil(month / 3),
      year,
      reach,
      impressions: Math.round(reach * (2.5 + random() * 0.6)),
      followers: cumulativeFollowers,
      newFollowers: newFollowersThisMonth,
      reactions: Math.round(reach * (0.04 + random() * 0.02)),
      comments: Math.round(reach * (0.004 + random() * 0.003)),
      shares: Math.round(reach * (0.006 + random() * 0.004)),
      clicks: Math.round(reach * (0.02 + random() * 0.015)),
      videoViews: 0,
    });
  }

  return rows;
}

export class MockLinkedInRepository implements DashboardRepository {
  async getDashboard(params: DashboardQueryParams): Promise<Result<DashboardApiResponse>> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const monthly = buildMonthlyMockData(params.year);
    const summary = monthly.reduce(
      (acc, row) => ({
        reach: acc.reach + row.reach,
        impressions: acc.impressions + row.impressions,
        followers: row.followers,
        reactions: acc.reactions + row.reactions,
        comments: acc.comments + row.comments,
        shares: acc.shares + row.shares,
        clicks: acc.clicks + row.clicks,
        videoViews: 0,
      }),
      {
        reach: 0,
        impressions: 0,
        followers: 0,
        reactions: 0,
        comments: 0,
        shares: 0,
        clicks: 0,
        videoViews: 0,
      }
    );

    const rawResponse = {
      success: true as const,
      message: "",
      version: "1.0.0-mock",
      updatedAt: new Date().toISOString(),
      executionTime: 300,
      data: { summary, weekly: [], monthly, quarterly: [], yearly: [] },
    };

    const parsed = apiBaseResponseSchema.safeParse(rawResponse);
    if (!parsed.success) {
      return err("INVALID_SCHEMA", "Mock LinkedIn data failed schema validation.");
    }
    return ok(parsed.data);
  }
}
