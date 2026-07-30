/**
 * Color tokens for contexts that require literal values (e.g. Recharts SVG fills).
 * CSS should always prefer the custom properties in styles/globals.css instead.
 * Keep this file in sync with 31_DESIGN_TOKENS_.md.
 */
export const BRAND_COLORS = {
  primary: "#147e93",
  primaryLight: "#2ca4bc",
  primaryDark: "#0e6173",
  accent: "#5fd4e8",
} as const;

export const SEMANTIC_COLORS = {
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  neutral: "#94a3b8",
} as const;

export const KPI_STATUS_COLORS = {
  critical: "#dc2626",
  warning: "#f59e0b",
  good: "#3b82f6",
  excellent: "#22c55e",
  outstanding: "#8b5cf6",
} as const;

export const CHART_SERIES_COLORS = {
  reach: BRAND_COLORS.primary,
  impressions: "#3b82f6",
  followers: "#22c55e",
  newFollowers: "#a855f7",
  reactions: "#ec4899",
  comments: "#f59e0b",
  shares: "#8b5cf6",
  clicks: "#06b6d4",
  videoViews: "#ef4444",
} as const;
