import { create } from "zustand";

export type NotificationVariant = "success" | "error" | "info" | "warning";

export interface AppNotification {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly variant: NotificationVariant;
}

interface NotificationState {
  readonly notifications: readonly AppNotification[];
  push: (notification: Omit<AppNotification, "id">) => void;
  dismiss: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  push: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id: crypto.randomUUID() }],
    })),
  dismiss: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
