import { pdf } from "@react-pdf/renderer";
import { generateExportFilename } from "@/lib/export/filename";

export async function downloadPdf(
  document: Parameters<typeof pdf>[0],
  filenamePrefix: string
): Promise<void> {
  const blob = await pdf(document).toBlob();
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = generateExportFilename(filenamePrefix, "pdf");
  link.click();
  URL.revokeObjectURL(url);
}
