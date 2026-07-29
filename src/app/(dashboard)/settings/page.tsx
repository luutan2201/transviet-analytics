import { SettingsContent } from "@/features/settings/components/settings-content";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <SettingsContent />;
}
