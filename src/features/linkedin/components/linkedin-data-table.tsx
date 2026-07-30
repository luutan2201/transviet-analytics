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
import { ArrowUpDown, ChevronLeft, ChevronRight, Table as TableIcon, Download } from "lucide-react";
import { TableContainer } from "@/components/shared/data-containers";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatFullNumber } from "@/utils/formatters";
import type { WeeklyMetricPoint } from "@/features/dashboard/types/dashboard.model";
import { exportToExcel } from "@/lib/export/excel-export";

const columnHelper = createColumnHelper<WeeklyMetricPoint>();

const MONTH_LABELS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const columns = [
  columnHelper.accessor("month", {
    header: "Tháng",
    cell: (info) => MONTH_LABELS[info.getValue() - 1],
  }),
  columnHelper.accessor("quarter", { header: "Quý", cell: (info) => `Q${info.getValue()}` }),
  columnHelper.accessor("impressions", {
    header: "Impressions",
    cell: (info) => formatFullNumber(info.getValue()),
  }),
  columnHelper.accessor("followers", {
    header: "Followers",
    cell: (info) => formatFullNumber(info.getValue()),
  }),
  columnHelper.accessor("reactions", {
    header: "Reactions",
    cell: (info) => formatFullNumber(info.getValue()),
  }),
  columnHelper.accessor("comments", {
    header: "Comments",
    cell: (info) => formatFullNumber(info.getValue()),
  }),
  columnHelper.accessor("shares", {
    header: "Shares",
    cell: (info) => formatFullNumber(info.getValue()),
  }),
  columnHelper.accessor("clicks", {
    header: "Clicks",
    cell: (info) => formatFullNumber(info.getValue()),
  }),
];

interface LinkedInDataTableProps {
  readonly data: readonly WeeklyMetricPoint[];
}

export function LinkedInDataTable({ data }: LinkedInDataTableProps) {
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

  function handleExport() {
    exportToExcel("linkedin-monthly-data", [
      {
        name: "LinkedIn Monthly",
        rows: data.map((row) => ({
          Tháng: row.month,
          Quý: row.quarter,
          Năm: row.year,
          Impressions: row.impressions,
          Followers: row.followers,
          Reactions: row.reactions,
          Comments: row.comments,
          Shares: row.shares,
          Clicks: row.clicks,
        })),
      },
    ]);
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={TableIcon}
        title="Chưa có dữ liệu LinkedIn"
        description="Chưa có dữ liệu tháng nào cho năm đã chọn."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
          <Download className="size-4" />
          Export Excel
        </Button>
      </div>

      <TableContainer>
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-[var(--card)] backdrop-blur">
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
                  <td
                    key={cell.id}
                    className="whitespace-nowrap px-4 py-3 text-[var(--foreground)]"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>

      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--muted-foreground)]">
          Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
