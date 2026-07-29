import {
  Activity,
  Eye,
  Users,
  Heart,
  MessageCircle,
  Share2,
  MousePointerClick,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";
import type { KpiMetric } from "@/config/kpi";

export const METRIC_ICONS: Readonly<Record<KpiMetric, LucideIcon>> = {
  reach: Activity,
  impressions: Eye,
  followers: Users,
  reactions: Heart,
  comments: MessageCircle,
  shares: Share2,
  clicks: MousePointerClick,
  videoViews: PlayCircle,
};
