"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { SettingsSection } from "@/features/settings/components/settings-section";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settings.store";
import { env } from "@/config/env";
import { useToast } from "@/hooks/use-toast";

type TestState = "idle" | "testing" | "success" | "failed";

export function DataSourceSettings() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const [draftUrl, setDraftUrl] = useState(settings.appsScriptUrlOverride ?? "");
  const [testState, setTestState] = useState<TestState>("idle");
  const { toast } = useToast();

  const effectiveUrl = settings.appsScriptUrlOverride || env.NEXT_PUBLIC_APPS_SCRIPT_URL;
  const usingMock = !effectiveUrl;

  async function handleTestConnection() {
    if (!draftUrl) return;
    setTestState("testing");
    try {
      const url = new URL(draftUrl);
      url.searchParams.set("action", "settings");
      const response = await fetch(url.toString());
      const json = (await response.json()) as { success?: boolean };
      setTestState(json.success ? "success" : "failed");
    } catch {
      setTestState("failed");
    }
  }

  function handleSave() {
    updateSettings({ appsScriptUrlOverride: draftUrl || null });
    toast({ title: "Đã lưu cấu hình nguồn dữ liệu", variant: "success" });
  }

  return (
    <SettingsSection
      title="Nguồn dữ liệu"
      description="URL Apps Script Web App kết nối tới Google Sheet"
    >
      <div className="glass-surface rounded-[var(--radius-lg)] p-3 text-sm">
        <span className="text-[var(--muted-foreground)]">Đang sử dụng: </span>
        <span className={usingMock ? "text-[var(--color-warning)]" : "text-[var(--color-success)]"}>
          {usingMock ? "Dữ liệu mẫu (chưa cấu hình Apps Script)" : "Google Sheet thật"}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="appsScriptUrl">Apps Script Web App URL</Label>
        <Input
          id="appsScriptUrl"
          placeholder="https://script.google.com/macros/s/XXXXX/exec"
          value={draftUrl}
          onChange={(e) => {
            setDraftUrl(e.target.value);
            setTestState("idle");
          }}
        />
        <p className="text-xs text-[var(--muted-foreground)]">
          Để trống để dùng dữ liệu mẫu. Xem hướng dẫn deploy trong thư mục{" "}
          <code className="rounded bg-[var(--muted)] px-1 py-0.5">apps-script/README.md</code>.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleTestConnection}
          disabled={!draftUrl || testState === "testing"}
        >
          {testState === "testing" && <Loader2 className="size-4 animate-spin" />}
          Kiểm tra kết nối
        </Button>
        {testState === "success" && (
          <span className="flex items-center gap-1 text-sm text-[var(--color-success)]">
            <CheckCircle2 className="size-4" /> Kết nối thành công
          </span>
        )}
        {testState === "failed" && (
          <span className="flex items-center gap-1 text-sm text-[var(--color-danger)]">
            <XCircle className="size-4" /> Không thể kết nối
          </span>
        )}
        <Button size="sm" onClick={handleSave} className="ml-auto">
          Lưu
        </Button>
      </div>
    </SettingsSection>
  );
}
