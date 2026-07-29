"use client";

import { useRef, useState } from "react";
import { Download, Upload, RotateCcw } from "lucide-react";
import { SettingsSection } from "@/features/settings/components/settings-section";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { useSettingsStore } from "@/stores/settings.store";
import { useToast } from "@/hooks/use-toast";
import { APP_NAME } from "@/config/constants";
import { env } from "@/config/env";

export function BackupSettings() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  function handleExport() {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transviet-analytics-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string);
        updateSettings(imported);
        toast({ title: "Đã khôi phục cài đặt", variant: "success" });
      } catch {
        toast({ title: "File không hợp lệ", variant: "error" });
      }
    };
    reader.readAsText(file);
  }

  return (
    <SettingsSection title="Sao lưu" description="Xuất hoặc khôi phục cấu hình">
      <div className="flex gap-3">
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
          <Download className="size-4" />
          Xuất cấu hình
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-4" />
          Nhập cấu hình
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleImport}
        />
      </div>
    </SettingsSection>
  );
}

export function DangerZoneSettings() {
  const resetSettings = useSettingsStore((s) => s.resetSettings);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toast } = useToast();

  function handleReset() {
    resetSettings();
    setConfirmOpen(false);
    toast({ title: "Đã đặt lại toàn bộ cài đặt", variant: "info" });
  }

  return (
    <SettingsSection title="Vùng nguy hiểm" description="Đặt lại toàn bộ cài đặt về mặc định">
      <Button
        variant="danger"
        size="sm"
        className="w-fit gap-2"
        onClick={() => setConfirmOpen(true)}
      >
        <RotateCcw className="size-4" />
        Đặt lại cài đặt
      </Button>

      <Modal open={confirmOpen} onOpenChange={setConfirmOpen}>
        <ModalContent className="max-w-sm">
          <ModalHeader>
            <ModalTitle>Đặt lại cài đặt?</ModalTitle>
            <ModalDescription>
              Toàn bộ cài đặt (thương hiệu, nguồn dữ liệu, bộ lọc mặc định...) sẽ trở về mặc định.
              Hành động này không thể hoàn tác.
            </ModalDescription>
          </ModalHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setConfirmOpen(false)}>
              Hủy
            </Button>
            <Button variant="danger" size="sm" onClick={handleReset}>
              Đặt lại
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </SettingsSection>
  );
}

export function AboutSettings() {
  return (
    <SettingsSection title="Về ứng dụng">
      <div className="flex flex-col gap-1 text-sm text-[var(--muted-foreground)]">
        <p>
          {APP_NAME} · phiên bản {env.NEXT_PUBLIC_APP_VERSION}
        </p>
        <p>Môi trường: {process.env.NODE_ENV}</p>
      </div>
    </SettingsSection>
  );
}
