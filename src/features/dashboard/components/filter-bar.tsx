"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import { useFilterStore, type FilterPeriod } from "@/stores/filter.store";

const ALL_PERIOD_OPTIONS: readonly { value: FilterPeriod; label: string }[] = [
  { value: "week", label: "Tuần" },
  { value: "month", label: "Tháng" },
  { value: "quarter", label: "Quý" },
  { value: "year", label: "Năm" },
];

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `Tháng ${i + 1}`,
}));

const QUARTER_OPTIONS = [1, 2, 3, 4].map((q) => ({ value: String(q), label: `Quý ${q}` }));

function buildYearOptions(currentYear: number) {
  return Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => ({
    value: String(y),
    label: String(y),
  }));
}

interface FilterBarProps {
  /** Restricts which period tabs are shown — defaults to all 4. LinkedIn only supports month/quarter/year. */
  readonly periods?: readonly FilterPeriod[];
}

export function FilterBar({ periods }: FilterBarProps = {}) {
  const { period, year, month, quarter, setPeriod, setYear, setMonth, setQuarter, reset } =
    useFilterStore();

  const periodOptions = periods
    ? ALL_PERIOD_OPTIONS.filter((o) => periods.includes(o.value))
    : ALL_PERIOD_OPTIONS;

  const now = new Date();
  const yearOptions = buildYearOptions(now.getFullYear());

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="flex flex-wrap items-center gap-3 p-4">
        <div className="flex gap-1 rounded-[var(--radius-button)] bg-[var(--muted)] p-1">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={`relative rounded-[calc(var(--radius-button)-4px)] px-4 py-1.5 text-sm font-medium transition-colors ${
                period === option.value
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-[var(--border)]" />

        <div className="flex flex-1 flex-wrap items-center gap-3">
          <SelectField
            className="w-28"
            options={yearOptions}
            value={String(year)}
            onChange={(e) => setYear(Number(e.target.value))}
          />

          {period === "month" && (
            <SelectField
              className="w-36"
              options={MONTH_OPTIONS}
              value={String(month ?? 1)}
              onChange={(e) => setMonth(Number(e.target.value))}
            />
          )}

          {period === "quarter" && (
            <SelectField
              className="w-28"
              options={QUARTER_OPTIONS}
              value={String(quarter ?? 1)}
              onChange={(e) => setQuarter(Number(e.target.value))}
            />
          )}
        </div>

        <Button variant="ghost" size="sm" className="gap-1.5" onClick={reset}>
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </GlassCard>
    </motion.div>
  );
}
