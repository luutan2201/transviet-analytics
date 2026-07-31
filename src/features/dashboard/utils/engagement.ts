interface EngagementInputs {
  readonly reactions: number;
  readonly comments: number;
  readonly shares: number;
  readonly impressions: number;
}

/**
 * Engagement Rate (%) = (Reactions + Comments + Shares) / Impressions × 100.
 * Uses Impressions (not Reach) as the denominator so the formula is
 * consistent across platforms — LinkedIn has no Reach data.
 * Returns 0 if Impressions is 0 (avoid divide by zero).
 */
export function calculateEngagementRate(input: EngagementInputs): number {
  if (input.impressions === 0) return 0;
  return ((input.reactions + input.comments + input.shares) / input.impressions) * 100;
}
