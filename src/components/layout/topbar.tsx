"use client";

import * as React from "react";
import { Search, Bell, RefreshCw, Menu, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebarStore } from "@/stores/sidebar.store";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/features/authentication/components/user-menu";
import { useCurrentUser } from "@/features/authentication/hooks/use-current-user";

export function Topbar() {
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  useCurrentUser();

  return (
    <header
      data-print-hide
      className="glass-surface sticky top-0 z-[var(--z-dropdown)] flex h-[var(--topbar-height)] shrink-0 items-center justify-between gap-4 border-b px-4 md:px-6"
    >
      <div className="flex flex-1 items-center gap-3">
        <Button
          variant="ghost"
          size="iconOnly"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>

        <div className="relative hidden max-w-sm flex-1 sm:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <Input placeholder="Tìm kiếm..." className="h-10 pl-10" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" className="hidden gap-2 sm:inline-flex">
          <RefreshCw className="size-4" />
          Sync
        </Button>
        <Button variant="ghost" size="iconOnly" aria-label="Print" onClick={() => window.print()}>
          <Printer className="size-5" />
        </Button>
        <Button variant="ghost" size="iconOnly" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
