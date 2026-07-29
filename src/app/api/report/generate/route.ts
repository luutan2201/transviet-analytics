import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { serverEnv } from "@/config/env.server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { ClaudeProvider } from "@/features/report/services/providers/claude.provider";
import { OpenAIProvider } from "@/features/report/services/providers/openai.provider";
import { GeminiProvider } from "@/features/report/services/providers/gemini.provider";
import type { AIProvider } from "@/features/report/services/ai-provider";
import { buildReportPrompt } from "@/features/report/utils/prompt-builder";
import { validateReportMarkdown } from "@/features/report/utils/report-validator";
import { generateFallbackReport } from "@/features/report/utils/fallback-report-generator";
import type { ReportContext } from "@/features/report/types/report.types";

const MAX_REGENERATE_ATTEMPTS = 2;

const requestSchema = z.object({
  context: z.custom<ReportContext>(),
});

function resolveProvider(): { provider: AIProvider; name: string } | null {
  if (!serverEnv.AI_PROVIDER || !serverEnv.AI_API_KEY) return null;

  switch (serverEnv.AI_PROVIDER) {
    case "claude":
      return { provider: new ClaudeProvider(), name: "claude" };
    case "openai":
      return { provider: new OpenAIProvider(), name: "openai" };
    case "gemini":
      return { provider: new GeminiProvider(), name: "gemini" };
    default:
      return null;
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token, serverEnv.AUTH_SESSION_SECRET) : null;
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Dữ liệu yêu cầu không hợp lệ." },
      { status: 400 }
    );
  }

  const { context } = parsed.data;
  const resolved = resolveProvider();

  // No AI provider configured — use the rule-based fallback (always valid, per its own construction).
  if (!resolved) {
    const markdown = generateFallbackReport(context);
    return NextResponse.json({ success: true, markdown, provider: "rule-based" });
  }

  const prompt = buildReportPrompt(context);

  for (let attempt = 1; attempt <= MAX_REGENERATE_ATTEMPTS; attempt += 1) {
    try {
      const markdown = await resolved.provider.generate(prompt, {
        apiKey: serverEnv.AI_API_KEY!,
        model: serverEnv.AI_MODEL,
      });

      const validation = validateReportMarkdown(markdown, context.reportType);
      if (validation.valid) {
        return NextResponse.json({ success: true, markdown, provider: resolved.name });
      }

      if (attempt === MAX_REGENERATE_ATTEMPTS) {
        // Final attempt still invalid — fall back to the rule-based report rather than
        // showing the user a broken/incomplete AI response.
        const fallbackMarkdown = generateFallbackReport(context);
        return NextResponse.json({
          success: true,
          markdown: fallbackMarkdown,
          provider: "rule-based-fallback",
        });
      }
    } catch {
      if (attempt === MAX_REGENERATE_ATTEMPTS) {
        return NextResponse.json(
          {
            success: false,
            message: "Không thể tạo báo cáo AI lúc này. Vui lòng thử lại sau.",
          },
          { status: 502 }
        );
      }
    }
  }

  return NextResponse.json({ success: false, message: "Không thể tạo báo cáo." }, { status: 500 });
}
