"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TableContainer } from "@/components/shared/data-containers";
import { Badge } from "@/components/ui/badge";
import type { KpiModel } from "@/features/kpi/types/kpi.model";
import { METRIC_LABELS } from "@/features/dashboard/types/dashboard.model";
import {
  KPI_STATUS_LABELS,
  KPI_STATUS_BADGE_VARIANT,
} from "@/features/kpi/config/kpi-status-labels";
import { formatCompactNumber, formatPercent } from "@/utils/formatters";

const columnHelper = createColumnHelper<KpiModel>();
const TREND_ICON = { up: TrendingUp, down: TrendingDown, stable: Minus } as const;

const columns = [
  columnHelper.accessor((row) => METRIC_LABELS[row.metric], {
    id: "metric",
    header: "Chỉ số",
  }),
  columnHelper.accessor("current", {
    header: "Hiện tại",
    cell: (info) => formatCompactNumber(info.getValue()),
  }),
  columnHelper.accessor("target", {
    header: "Mục tiêu",
    cell: (info) => (info.getValue() !== null ? formatCompactNumber(info.getValue()!) : "—"),
  }),
  columnHelper.accessor("completion", {
    header: "Hoàn thành",
    cell: (info) => (info.getValue() !== null ? formatPercent(info.getValue()!) : "—"),
  }),
  columnHelper.accessor("forecast", {
    header: "Dự báo",
    cell: (info) => (info.getValue() !== null ? formatCompactNumber(info.getValue()!) : "—"),
  }),
  columnHelper.accessor("trend", {
    header: "Xu hướng",
    cell: (info) => {
      const Icon = TREND_ICON[info.getValue()];
      return <Icon className="size-4" />;
    },
  }),
  columnHelper.accessor("status", {
    header: "Trạng thái",
    cell: (info) => (
      <Badge variant={KPI_STATUS_BADGE_VARIANT[info.getValue()]}>
        {KPI_STATUS_LABELS[info.getValue()]}
      </Badge>
    ),
  }),
];

interface KpiTableProps {
  readonly data: readonly KpiModel[];
}

export function KpiTable({ data }: KpiTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const tableData = useMemo(() => [...data], [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <TableContainer>
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-[var(--border)]">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-[var(--muted-foreground)]"
                >
                  <span className="flex items-center gap-1.5">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <ArrowUpDown className="size-3" />
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[var(--border)] transition-colors last:border-0 hover:bg-[var(--glass-hover)]"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="whitespace-nowrap px-4 py-3 text-[var(--foreground)]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  );
}
