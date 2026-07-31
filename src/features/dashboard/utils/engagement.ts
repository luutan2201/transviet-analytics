interface EngagementInputs {
  readonly reach: number;
  readonly impressions: number;
  readonly reactions: number;
  readonly comments: number;
  readonly shares: number;
  readonly clicks: number;
}

export type EngagementPlatform = "facebook" | "linkedin";

/**
 * Engagement Rate (%) = (Reactions + Comments + Shares + Clicks) / Denominator × 100.
 * Denominator is platform-specific: Reach for Facebook, Impressions for
 * LinkedIn (LinkedIn has no Reach data, so Reach would always be 0 there).
 * Returns 0 if the denominator is 0 (avoid divide by zero).
 */
export function calculateEngagementRate(
  input: EngagementInputs,
  platform: EngagementPlatform = "facebook"
): number {
  const denominator = platform === "facebook" ? input.reach : input.impressions;
  if (denominator === 0) return 0;
  return ((input.reactions + input.comments + input.shares + input.clicks) / denominator) * 100;
}
