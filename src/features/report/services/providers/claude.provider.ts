import "server-only";
import type { AIProvider, AIGenerationConfig } from "@/features/report/services/ai-provider";

export class ClaudeProvider implements AIProvider {
  async generate(prompt: string, config: AIGenerationConfig): Promise<string> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model || "claude-sonnet-4-5",
        max_tokens: config.maxTokens ?? 4000,
        temperature: config.temperature ?? 0.7,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      content?: readonly { type: string; text?: string }[];
    };
    const textBlock = data.content?.find((block) => block.type === "text");
    if (!textBlock?.text) {
      throw new Error("Claude API returned no text content.");
    }
    return textBlock.text;
  }
}
