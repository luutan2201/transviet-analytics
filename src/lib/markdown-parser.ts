export type MarkdownBlock =
  | { readonly type: "heading"; readonly text: string }
  | { readonly type: "paragraph"; readonly text: string }
  | { readonly type: "list"; readonly items: readonly string[] };

/** Parses the controlled markdown subset our report generators always produce. */
export function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.split("\n");
  const blocks: MarkdownBlock[] = [];
  let listBuffer: string[] = [];

  function flushList() {
    if (listBuffer.length > 0) {
      blocks.push({ type: "list", items: listBuffer });
      listBuffer = [];
    }
  }

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (trimmed.startsWith("## ")) {
      flushList();
      blocks.push({ type: "heading", text: trimmed.slice(3) });
      continue;
    }

    if (trimmed.startsWith("- ")) {
      listBuffer.push(trimmed.slice(2));
      continue;
    }

    flushList();
    if (trimmed.length > 0) {
      blocks.push({ type: "paragraph", text: trimmed });
    }
  }

  flushList();
  return blocks;
}

/** Strips markdown bold markers (**text**) for renderers that don't support inline styling. */
export function stripBold(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1");
}
