"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { SettingsSection } from "@/features/settings/components/settings-section";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settings.store";
import { useToast } from "@/hooks/use-toast";

const MAX_LOGO_SIZE_BYTES = 500 * 1024; // 500KB — logos are stored as data URLs in local storage

export function BrandSettings() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_LOGO_SIZE_BYTES) {
      toast({
        title: "Logo quá lớn",
        description: "Vui lòng chọn ảnh dưới 500KB.",
        variant: "error",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateSettings({ logoDataUrl: reader.result as string });
      toast({ title: "Đã cập nhật logo", variant: "success" });
    };
    reader.readAsDataURL(file);
  }

  return (
    <SettingsSection title="Thương hiệu" description="Màu thương hiệu và logo công ty">
      <div className="flex flex-col gap-2">
        <Label htmlFor="brandColor">Màu thương hiệu</Label>
        <div className="flex items-center gap-3">
          <input
            id="brandColor"
            type="color"
            value={settings.brandColor}
            onChange={(e) => updateSettings({ brandColor: e.target.value })}
            className="size-11 cursor-pointer rounded-[var(--radius-button)] border border-[var(--border)] bg-transparent"
          />
          <Input
            value={settings.brandColor}
            onChange={(e) => updateSettings({ brandColor: e.target.value })}
            className="w-32 font-mono"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Logo</Label>
        <div className="flex items-center gap-3">
          {settings.logoDataUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded data URL, not an optimizable static asset */}
              <img
                src={settings.logoDataUrl}
                alt="Logo"
                className="size-14 rounded-[var(--radius-md)] border border-[var(--border)] object-contain"
              />
              <button
                onClick={() => updateSettings({ logoDataUrl: null })}
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-[var(--destructive)] text-white"
                aria-label="Xoá logo"
              >
                <X className="size-3" />
              </button>
            </div>
          ) : (
            <div className="flex size-14 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border)] text-[var(--muted-foreground)]">
              <Upload className="size-5" />
            </div>
          )}
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            Tải logo lên
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </div>
      </div>
    </SettingsSection>
  );
}
