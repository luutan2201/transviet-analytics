"use client";

import { useState } from "react";
import { Target } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { FACEBOOK_METRICS, type KpiMetric } from "@/config/kpi";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import { useKpiTargetsStore, type KpiPlatform } from "@/stores/kpi-targets.store";
import { useToast } from "@/hooks/use-toast";

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `Tháng ${i + 1}`,
}));

function getNextMonth(): { month: number; year: number } {
  const now = new Date();
  const nextMonth = now.getMonth() + 2; // getMonth() is 0-indexed; +2 = next month, 1-indexed
  if (nextMonth > 12) return { month: 1, year: now.getFullYear() + 1 };
  return { month: nextMonth, year: now.getFullYear() };
}

interface SetKpiTargetDialogProps {
  readonly trigger?: React.ReactNode;
  readonly platform?: KpiPlatform;
  readonly metrics?: readonly KpiMetric[];
}

export function SetKpiTargetDialog({
  trigger,
  platform = "facebook",
  metrics = FACEBOOK_METRICS,
}: SetKpiTargetDialogProps) {
  const [open, setOpen] = useState(false);
  const defaultNext = getNextMonth();
  const metricOptions = metrics.map((m) => ({ value: m, label: METRIC_LABELS[m] }));

  const [metric, setMetric] = useState<KpiMetric>(metrics[0] ?? "reach");
  const [targetValue, setTargetValue] = useState("");
  const [month, setMonth] = useState(defaultNext.month);
  const [year, setYear] = useState(defaultNext.year);

  const setTarget = useKpiTargetsStore((s) => s.setTarget);
  const { toast } = useToast();

  const yearOptions = [defaultNext.year, defaultNext.year + 1].map((y) => ({
    value: String(y),
    label: String(y),
  }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numericTarget = Number(targetValue);
    if (!numericTarget || numericTarget <= 0) {
      toast({ title: "Mục tiêu phải lớn hơn 0", variant: "error" });
      return;
    }

    setTarget(platform, metric, numericTarget, month, year);
    toast({
      title: "Đã đặt KPI",
      description: `${METRIC_LABELS[metric]} · Tháng ${month}/${year} · Mục tiêu ${numericTarget.toLocaleString("vi-VN")}`,
      variant: "success",
    });
    setTargetValue("");
    setOpen(false);
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
          <Target className="size-4" />
          Đặt KPI
        </Button>
      )}

      <ModalContent className="max-w-sm">
        <ModalHeader>
          <ModalTitle>Đặt mục tiêu KPI</ModalTitle>
          <ModalDescription>
            Mục tiêu được lưu trên trình duyệt này, dùng để theo dõi tiến độ ngay trên dashboard.
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="kpi-metric">Chỉ số</Label>
            <SelectField
              id="kpi-metric"
              options={metricOptions}
              value={metric}
              onChange={(e) => setMetric(e.target.value as KpiMetric)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="kpi-target">Mục tiêu</Label>
            <Input
              id="kpi-target"
              type="number"
              min={1}
              placeholder="Ví dụ: 50000"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="kpi-month">Tháng</Label>
              <SelectField
                id="kpi-month"
                options={MONTH_OPTIONS}
                value={String(month)}
                onChange={(e) => setMonth(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="kpi-year">Năm</Label>
              <SelectField
                id="kpi-year"
                options={yearOptions}
                value={String(year)}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" size="sm">
              Lưu mục tiêu
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
