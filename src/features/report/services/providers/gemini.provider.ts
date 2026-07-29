import "server-only";
import type { AIProvider, AIGenerationConfig } from "@/features/report/services/ai-provider";

export class GeminiProvider implements AIProvider {
  async generate(prompt: string, config: AIGenerationConfig): Promise<string> {
    const model = config.model || "gemini-1.5-pro";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: config.temperature ?? 0.7,
          maxOutputTokens: config.maxTokens ?? 4000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      candidates?: readonly { content?: { parts?: readonly { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Gemini API returned no text content.");
    }
    return text;
  }
}
