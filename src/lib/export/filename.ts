function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Generates a consistent, collision-resistant filename: prefix_YYYYMMDD_HHmm.ext */
export function generateExportFilename(prefix: string, extension: string): string {
  const now = new Date();
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}`;
  const sanitizedPrefix = prefix
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${sanitizedPrefix}_${datePart}_${timePart}.${extension}`;
}
