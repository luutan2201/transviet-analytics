import { useNotificationStore, type NotificationVariant } from "@/stores/notification.store";

interface ToastInput {
  readonly title: string;
  readonly description?: string;
  readonly variant?: NotificationVariant;
}

export function useToast() {
  const push = useNotificationStore((s) => s.push);

  function toast({ title, description, variant = "info" }: ToastInput) {
    push({ title, description, variant });
  }

  return { toast };
}
