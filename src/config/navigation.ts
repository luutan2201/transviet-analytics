import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  TrendingUp,
  Target,
  Lightbulb,
  FileText,
  Download,
  Settings,
  Share2,
  Globe,
} from "lucide-react";
import { ROUTES } from "@/config/routes";

export interface NavigationItem {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly disabled?: boolean;
  readonly badge?: string;
}

/** Primary sidebar navigation — current platform (Facebook). */
export const PRIMARY_NAVIGATION: readonly NavigationItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Performance", href: ROUTES.performance, icon: TrendingUp },
  { label: "KPI", href: ROUTES.kpi, icon: Target },
  { label: "Insights", href: ROUTES.insights, icon: Lightbulb },
  { label: "AI Report", href: ROUTES.report, icon: FileText },
  { label: "Export", href: ROUTES.export, icon: Download },
] as const;

/** Additional connected platforms. */
export const PLATFORMS_NAVIGATION: readonly NavigationItem[] = [
  { label: "LinkedIn", href: ROUTES.linkedin, icon: Share2 },
  { label: "LinkedIn KPI", href: ROUTES.linkedinKpi, icon: Target },
  { label: "LinkedIn Report", href: ROUTES.linkedinReport, icon: FileText },
] as const;

/** Future platform modules — rendered disabled until their feature module ships. */
export const FUTURE_NAVIGATION: readonly NavigationItem[] = [
  { label: "Website", href: "#", icon: Globe, disabled: true, badge: "Soon" },
] as const;

export const SETTINGS_NAVIGATION: NavigationItem = {
  label: "Settings",
  href: ROUTES.settings,
  icon: Settings,
};
