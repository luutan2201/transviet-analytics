import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { PageTransition } from "@/components/layout/page-transition";
import { Container } from "@/components/shared/layout-primitives";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-gradient-bg flex min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-toast)] focus:rounded-[var(--radius-button)] focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-white"
      >
        Bỏ qua đến nội dung chính
      </a>
      <Sidebar />
      <MobileSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main id="main-content" className="flex-1">
          <Container className="py-6 md:py-8">
            <PageTransition>{children}</PageTransition>
          </Container>
        </main>
      </div>
    </div>
  );
}
