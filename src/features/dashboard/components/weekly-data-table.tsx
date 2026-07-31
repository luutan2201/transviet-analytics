"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Table as TableIcon,
  Download,
} from "lucide-react";
import { TableContainer } from "@/components/shared/data-containers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatFullNumber, formatPercent } from "@/utils/formatters";
import type { WeeklyMetricPoint } from "@/features/dashboard/types/dashboard.model";
import { exportToExcel } from "@/lib/export/excel-export";
import { calculateEngagementRate } from "@/features/dashboard/utils/engagement";

const columnHelper = createColumnHelper<WeeklyMetricPoint>();

const columns = [
  columnHelper.accessor("week", { header: "Tuần" }),
  columnHelper.accessor("month", { header: "Tháng" }),
  columnHelper.accessor("quarter", { header: "Quý", cell: (info) => `Q${info.getValue()}` }),
  columnHelper.accessor("reach", {
    header: "Reach",
    cell: (info) => formatFullNumber(info.getValue()),
  }),
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
  columnHelper.accessor("videoViews", {
    header: "Video Views",
    cell: (info) => formatFullNumber(info.getValue()),
  }),
  columnHelper.display({
    id: "engagementRate",
    header: "Engagement Rate",
    cell: (info) => formatPercent(calculateEngagementRate(info.row.original)),
  }),
];

interface WeeklyDataTableProps {
  readonly data: readonly WeeklyMetricPoint[];
}

export function WeeklyDataTable({ data }: WeeklyDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const tableData = useMemo(() => [...data], [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (data.length === 0) {
    return (
      <EmptyState
        icon={TableIcon}
        title="Chưa có dữ liệu tuần"
        description="Không tìm thấy dữ liệu cho khoảng thời gian đã chọn."
      />
    );
  }

  function handleExport() {
    exportToExcel("weekly-data", [
      {
        name: "Weekly Data",
        rows: data.map((row) => ({
          Tuần: row.week,
          Tháng: row.month,
          Quý: row.quarter,
          Năm: row.year,
          Reach: row.reach,
          Impressions: row.impressions,
          Followers: row.followers,
          Reactions: row.reactions,
          Comments: row.comments,
          Shares: row.shares,
          Clicks: row.clicks,
          "Video Views": row.videoViews,
          "Engagement Rate (%)": Number(calculateEngagementRate(row).toFixed(2)),
        })),
      },
    ]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Tìm kiếm tuần..."
            className="h-10 pl-10"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
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
