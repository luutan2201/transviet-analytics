"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { reportService } from "@/features/report/services/report.service";
import type { ReportContext, GeneratedReport } from "@/features/report/types/report.types";
import { useToast } from "@/hooks/use-toast";

export function useGenerateReport() {
  const [history, setHistory] = useState<readonly GeneratedReport[]>([]);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (context: ReportContext) => reportService.generateReport(context),
    onSuccess: (result, context) => {
      if (!result.success || !result.markdown) {
        toast({
          title: "Không thể tạo báo cáo",
          description: result.message ?? "Vui lòng thử lại.",
          variant: "error",
        });
        return;
      }

      const report: GeneratedReport = {
        id: crypto.randomUUID(),
        reportType: context.reportType,
        periodLabel: context.periodLabel,
        markdown: result.markdown,
        provider: result.provider ?? "unknown",
        generatedAt: new Date().toISOString(),
      };

      setHistory((prev) => [report, ...prev].slice(0, 10));
      toast({ title: "Đã tạo báo cáo thành công", variant: "success" });
    },
    onError: () => {
      toast({ title: "Không thể tạo báo cáo", description: "Đã có lỗi xảy ra.", variant: "error" });
    },
  });

  return { ...mutation, history, latestReport: history[0] ?? null };
}
