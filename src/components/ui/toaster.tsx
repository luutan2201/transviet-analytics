"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useNotificationStore, type NotificationVariant } from "@/stores/notification.store";
import { cn } from "@/lib/utils";

const VARIANT_ICON: Record<NotificationVariant, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const VARIANT_COLOR: Record<NotificationVariant, string> = {
  success: "text-[var(--color-success)]",
  error: "text-[var(--color-danger)]",
  info: "text-[var(--color-info)]",
  warning: "text-[var(--color-warning)]",
};

const AUTO_HIDE_MS = 5000;

export function Toaster() {
  const notifications = useNotificationStore((s) => s.notifications);
  const dismiss = useNotificationStore((s) => s.dismiss);

  React.useEffect(() => {
    const timers = notifications.map((n) => setTimeout(() => dismiss(n.id), AUTO_HIDE_MS));
    return () => timers.forEach(clearTimeout);
  }, [notifications, dismiss]);

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-[var(--z-toast)] flex w-full max-w-sm flex-col gap-3"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence initial={false}>
        {notifications.map((notification) => {
          const Icon = VARIANT_ICON[notification.variant];
          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="glass-surface pointer-events-auto flex items-start gap-3 rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-hover)]"
            >
              <Icon className={cn("mt-0.5 size-5 shrink-0", VARIANT_COLOR[notification.variant])} />
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--foreground)]">{notification.title}</p>
                {notification.description && (
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                    {notification.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(notification.id)}
                className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                aria-label="Dismiss notification"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
