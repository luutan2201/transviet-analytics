import { DashboardLayout } from "@/layouts/dashboard-layout";

export default function DashboardRouteLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
