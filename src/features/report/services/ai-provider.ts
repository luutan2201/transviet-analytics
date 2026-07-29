import "server-only";

export interface AIGenerationConfig {
  readonly apiKey: string;
  readonly model?: string;
  readonly temperature?: number;
  readonly maxTokens?: number;
}

export interface AIProvider {
  generate(prompt: string, config: AIGenerationConfig): Promise<string>;
}
