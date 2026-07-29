"use client";

import { Info } from "lucide-react";
import { SettingsSection } from "@/features/settings/components/settings-section";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { useSettingsStore } from "@/stores/settings.store";

const FILTER_OPTIONS = [
  { value: "week", label: "Tuần" },
  { value: "month", label: "Tháng" },
  { value: "quarter", label: "Quý" },
  { value: "year", label: "Năm" },
];

export function DefaultFilterSettings() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  return (
    <SettingsSection
      title="Bộ lọc mặc định"
      description="Khoảng thời gian hiển thị khi mở Dashboard"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="defaultFilter">Loại bộ lọc</Label>
        <SelectField
          id="defaultFilter"
          className="w-48"
          options={FILTER_OPTIONS}
          value={settings.defaultFilter}
          onChange={(e) =>
            updateSettings({
              defaultFilter: e.target.value as typeof settings.defaultFilter,
            })
          }
        />
      </div>
    </SettingsSection>
  );
}

export function AIProviderInfo() {
  return (
    <SettingsSection
      title="AI Provider"
      description="Cấu hình nhà cung cấp AI cho module AI Report"
    >
      <div className="glass-surface flex items-start gap-3 rounded-[var(--radius-lg)] p-4 text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-[var(--primary)]" />
        <div className="flex flex-col gap-1 text-[var(--muted-foreground)]">
          <p>
            API Key của AI Provider (Claude / OpenAI / Gemini) là thông tin nhạy cảm và chỉ được cấu
            hình phía server để đảm bảo an toàn — không thể chỉnh sửa từ giao diện này.
          </p>
          <p>
            Để cấu hình, thêm{" "}
            <code className="rounded bg-[var(--muted)] px-1 py-0.5">AI_PROVIDER</code>,{" "}
            <code className="rounded bg-[var(--muted)] px-1 py-0.5">AI_API_KEY</code>,{" "}
            <code className="rounded bg-[var(--muted)] px-1 py-0.5">AI_MODEL</code> vào{" "}
            <code className="rounded bg-[var(--muted)] px-1 py-0.5">.env.local</code> (hoặc biến môi
            trường trên Vercel) rồi khởi động lại ứng dụng.
          </p>
          <p>Khi chưa cấu hình, AI Report sẽ dùng bộ tạo báo cáo dựa trên quy tắc (rule-based).</p>
        </div>
      </div>
    </SettingsSection>
  );
}
