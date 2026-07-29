export const APP_NAME = "TransViet Analytics";

/** Cache TTL in milliseconds — see 03_Technical_Architecture.md CACHE STRATEGY. */
export const CACHE_TTL = {
  dashboard: 5 * 60 * 1000,
  settings: 30 * 60 * 1000,
  staticConfig: 24 * 60 * 60 * 1000,
} as const;

export const MAX_INSIGHTS = 5;

export const SYNC_RETRY_ATTEMPTS = 3;

export const BREAKPOINTS = {
  mobile: 390,
  tablet: 768,
  laptop: 1280,
  desktop: 1440,
  ultra: 1920,
} as const;
