import "server-only";
import type { AIProvider, AIGenerationConfig } from "@/features/report/services/ai-provider";

export class OpenAIProvider implements AIProvider {
  async generate(prompt: string, config: AIGenerationConfig): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || "gpt-4o",
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens ?? 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: readonly { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error("OpenAI API returned no text content.");
    }
    return text;
  }
}
