import { generateExportFilename } from "@/lib/export/filename";

export interface ExcelSheet {
  readonly name: string;
  readonly rows: readonly Record<string, string | number>[];
}

/** Exports one or more datasets to a single .xlsx workbook, one worksheet per dataset. */
export async function exportToExcel(
  filenamePrefix: string,
  sheets: readonly ExcelSheet[]
): Promise<void> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();

  for (const sheet of sheets) {
    const worksheet = XLSX.utils.json_to_sheet([...sheet.rows]);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name.slice(0, 31));
  }

  const filename = generateExportFilename(filenamePrefix, "xlsx");
  XLSX.writeFile(workbook, filename);
}
