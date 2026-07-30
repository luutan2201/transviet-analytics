/**
 * Centralized route definitions.
 * Never hardcode path strings elsewhere — import from here.
 */
export const ROUTES = {
  login: "/login",
  dashboard: "/dashboard",
  performance: "/performance",
  kpi: "/kpi",
  insights: "/insights",
  report: "/report",
  export: "/export",
  settings: "/settings",
  linkedin: "/linkedin",
  linkedinKpi: "/linkedin/kpi",
  linkedinReport: "/linkedin/report",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/** Routes accessible without authentication. */
export const PUBLIC_ROUTES: readonly string[] = [ROUTES.login];

/** Default route to redirect to after login. */
export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.dashboard;
