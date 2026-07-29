import { Fragment } from "react";
import { parseMarkdownBlocks } from "@/lib/markdown-parser";

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
  });
}

interface MarkdownRendererProps {
  readonly markdown: string;
}

export function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  const blocks = parseMarkdownBlocks(markdown);

  return (
    <div className="text-sm">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2
              key={index}
              className="mb-3 mt-8 text-lg font-semibold text-[var(--foreground)] first:mt-0"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={index} className="my-3 flex flex-col gap-1.5 pl-5">
              {block.items.map((item, i) => (
                <li
                  key={i}
                  className="list-disc text-[var(--foreground)] marker:text-[var(--primary)]"
                >
                  {renderInline(item, `li-${index}-${i}`)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="mb-3 leading-relaxed text-[var(--foreground)]">
            {renderInline(block.text, `p-${index}`)}
          </p>
        );
      })}
    </div>
  );
}
