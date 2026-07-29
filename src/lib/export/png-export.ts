import { generateExportFilename } from "@/lib/export/filename";

export async function exportElementAsPng(
  element: HTMLElement,
  filenamePrefix: string
): Promise<void> {
  const { toPng } = await import("html-to-image");

  const dataUrl = await toPng(element, {
    backgroundColor:
      getComputedStyle(document.documentElement).getPropertyValue("--bg-dark").trim() || "#07161a",
    pixelRatio: 2,
    cacheBust: true,
  });

  const link = document.createElement("a");
  link.download = generateExportFilename(filenamePrefix, "png");
  link.href = dataUrl;
  link.click();
}
