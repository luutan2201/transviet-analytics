"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3 } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { PRIMARY_NAVIGATION, PLATFORMS_NAVIGATION, SETTINGS_NAVIGATION } from "@/config/navigation";
import { useSidebarStore } from "@/stores/sidebar.store";
import { cn } from "@/lib/utils";

export function MobileSidebar() {
  const isMobileOpen = useSidebarStore((s) => s.isMobileOpen);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  const pathname = usePathname();

  return (
    <Drawer open={isMobileOpen} onOpenChange={setMobileOpen}>
      <DrawerContent className="max-w-xs">
        <div className="mb-8 flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-[var(--radius-button)] bg-[var(--primary)]">
            <BarChart3 className="size-5 text-white" />
          </div>
          <span className="text-sm font-semibold text-[var(--foreground)]">
            TransViet Analytics
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {[...PRIMARY_NAVIGATION, ...PLATFORMS_NAVIGATION, SETTINGS_NAVIGATION].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-button)] px-3 py-2.5 text-sm font-medium",
                pathname === item.href
                  ? "bg-[var(--glass-hover)] text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--glass-hover)] hover:text-[var(--foreground)]"
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
