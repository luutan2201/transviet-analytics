"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronsLeft, ChevronsRight, BarChart3 } from "lucide-react";
import { PRIMARY_NAVIGATION, FUTURE_NAVIGATION, SETTINGS_NAVIGATION } from "@/config/navigation";
import { SIDEBAR_CONFIG } from "@/config/sidebar";
import { useSidebarStore } from "@/stores/sidebar.store";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  icon: Icon,
  label,
  disabled,
  badge,
  collapsed,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  disabled?: boolean;
  badge?: string;
  collapsed: boolean;
  active: boolean;
}) {
  return (
    <Link
      href={disabled ? "#" : href}
      aria-disabled={disabled}
      className={cn(
        "group relative flex items-center gap-3 rounded-[var(--radius-button)] px-3 py-2.5 text-sm font-medium transition-colors duration-[var(--duration-fast)]",
        active
          ? "bg-[var(--glass-hover)] text-[var(--primary)]"
          : "text-[var(--muted-foreground)] hover:bg-[var(--glass-hover)] hover:text-[var(--foreground)]",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      <Icon className="size-5 shrink-0" />
      {!collapsed && (
        <span className="flex flex-1 items-center justify-between">
          {label}
          {badge && (
            <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] text-[var(--muted-foreground)]">
              {badge}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);
  const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed);
  const setCollapsedAuto = useSidebarStore((s) => s.setCollapsedAuto);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(min-width: ${SIDEBAR_CONFIG.collapsedBreakpoint}px) and (max-width: 1279px)`
    );
    const handleChange = (e: MediaQueryList | MediaQueryListEvent) => setCollapsedAuto(e.matches);
    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [setCollapsedAuto]);

  return (
    <motion.aside
      data-print-hide
      animate={{ width: isCollapsed ? "var(--sidebar-width-collapsed)" : "var(--sidebar-width)" }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="glass-surface sticky top-0 hidden h-screen shrink-0 flex-col gap-6 overflow-hidden border-r p-4 md:flex"
    >
      <div className="flex items-center gap-2.5 px-1">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--primary)]">
          <BarChart3 className="size-5 text-white" />
        </div>
        {!isCollapsed && (
          <span className="truncate text-sm font-semibold text-[var(--foreground)]">
            TransViet Analytics
          </span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {PRIMARY_NAVIGATION.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            collapsed={isCollapsed}
            active={pathname === item.href}
          />
        ))}

        {!isCollapsed && (
          <p className="mb-1 mt-4 px-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Future
          </p>
        )}
        {FUTURE_NAVIGATION.map((item) => (
          <NavLink key={item.label} {...item} collapsed={isCollapsed} active={false} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-[var(--border)] pt-4">
        <NavLink
          {...SETTINGS_NAVIGATION}
          collapsed={isCollapsed}
          active={pathname === SETTINGS_NAVIGATION.href}
        />
        <button
          onClick={toggleCollapsed}
          className="flex items-center gap-3 rounded-[var(--radius-button)] px-3 py-2.5 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--glass-hover)] hover:text-[var(--foreground)]"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronsRight className="size-5" /> : <ChevronsLeft className="size-5" />}
          {!isCollapsed && <span>Thu gọn</span>}
        </button>
      </div>
    </motion.aside>
  );
}
