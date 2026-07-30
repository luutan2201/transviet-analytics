import type { KpiMetric } from "@/config/kpi";

/** LinkedIn's sheet has no Reach or Video Views columns — hidden everywhere on LinkedIn pages. */
export const LINKEDIN_METRICS: readonly KpiMetric[] = [
  "impressions",
  "followers",
  "newFollowers",
  "reactions",
  "comments",
  "shares",
  "clicks",
];
