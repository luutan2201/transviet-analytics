import { PageHeader } from "@/components/shared/layout-primitives";
import { GeneralSettings } from "@/features/settings/components/general-settings";
import { BrandSettings } from "@/features/settings/components/brand-settings";
import { DataSourceSettings } from "@/features/settings/components/data-source-settings";
import {
  DefaultFilterSettings,
  AIProviderInfo,
} from "@/features/settings/components/misc-settings";
import {
  BackupSettings,
  DangerZoneSettings,
  AboutSettings,
} from "@/features/settings/components/backup-danger-about";

export function SettingsContent() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Settings" subtitle="Cấu hình thương hiệu, giao diện và tích hợp dữ liệu" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GeneralSettings />
        <BrandSettings />
        <DataSourceSettings />
        <DefaultFilterSettings />
        <AIProviderInfo />
        <BackupSettings />
      </div>

      <DangerZoneSettings />
      <AboutSettings />
    </div>
  );
}
