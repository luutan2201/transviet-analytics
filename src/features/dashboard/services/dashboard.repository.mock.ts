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

/** Deterministic PRNG (mulberry32) — same seed always produces the same mock dataset. */
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

/** Weeks per calendar month, summing to 52 (Jan..Dec). */
const WEEKS_PER_MONTH = [4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5] as const;

function buildWeeklyMockData(year: number): WeeklyMetricRaw[] {
  const random = mulberry32(year * 7919);
  const rows: WeeklyMetricRaw[] = [];

  let cumulativeFollowers = 8000 + Math.floor(random() * 2000);
  let weekIndex = 1;

  WEEKS_PER_MONTH.forEach((weekCount, monthIdx) => {
    const month = monthIdx + 1;
    const quarter = Math.ceil(month / 3);

    for (let i = 0; i < weekCount; i += 1) {
      // Gentle upward seasonal trend with noise, so charts look realistic rather than flat/random.
      const seasonalBoost = 1 + monthIdx * 0.015;
      const noise = 0.85 + random() * 0.3;

      const reach = Math.round(9000 * seasonalBoost * noise);
      const impressions = Math.round(reach * (3.2 + random() * 0.8));
      const reactions = Math.round(reach * (0.03 + random() * 0.02));
      const comments = Math.round(reactions * (0.08 + random() * 0.05));
      const shares = Math.round(reactions * (0.05 + random() * 0.03));
      const clicks = Math.round(reach * (0.015 + random() * 0.01));
      const videoViews = Math.round(reach * (0.4 + random() * 0.3));

      cumulativeFollowers += Math.round(20 + random() * 60);

      rows.push({
        week: `W${String(weekIndex).padStart(2, "0")}`,
        month,
        quarter,
        year,
        reach,
        impressions,
        followers: cumulativeFollowers,
        reactions,
        comments,
        shares,
        clicks,
        videoViews,
      });

      weekIndex += 1;
    }
  });

  return rows;
}

export class MockDashboardRepository implements DashboardRepository {
  async getDashboard(params: DashboardQueryParams): Promise<Result<DashboardApiResponse>> {
    // Simulate realistic network latency so loading/skeleton states are exercised.
    await new Promise((resolve) => setTimeout(resolve, 350));

    const weekly = buildWeeklyMockData(params.year);
    const summary = weekly.reduce(
      (acc, row) => ({
        reach: acc.reach + row.reach,
        impressions: acc.impressions + row.impressions,
        followers: row.followers,
        reactions: acc.reactions + row.reactions,
        comments: acc.comments + row.comments,
        shares: acc.shares + row.shares,
        clicks: acc.clicks + row.clicks,
        videoViews: acc.videoViews + row.videoViews,
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
      executionTime: 350,
      data: {
        summary,
        weekly,
        monthly: [],
        quarterly: [],
        yearly: [],
      },
    };

    const parsed = apiBaseResponseSchema.safeParse(rawResponse);
    if (!parsed.success) {
      return err("INVALID_SCHEMA", "Mock data failed schema validation.");
    }

    return ok(parsed.data);
  }
}
