import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  AUTH_USERNAME: z.string().min(1, "AUTH_USERNAME is not configured"),
  AUTH_PASSWORD: z.string().min(1, "AUTH_PASSWORD is not configured"),
  AUTH_SESSION_SECRET: z.string().min(16, "AUTH_SESSION_SECRET must be at least 16 characters"),
  AI_PROVIDER: z.enum(["claude", "openai", "gemini"]).optional(),
  AI_API_KEY: z.string().optional(),
  AI_MODEL: z.string().optional(),
});

const parsed = serverEnvSchema.safeParse({
  AUTH_USERNAME: process.env.AUTH_USERNAME,
  AUTH_PASSWORD: process.env.AUTH_PASSWORD,
  AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
  AI_PROVIDER: process.env.AI_PROVIDER || undefined,
  AI_API_KEY: process.env.AI_API_KEY || undefined,
  AI_MODEL: process.env.AI_MODEL || undefined,
});

if (!parsed.success) {
  console.error("Invalid server environment configuration", parsed.error.flatten().fieldErrors);
  throw new Error(
    "Invalid server environment configuration. Check AUTH_USERNAME, AUTH_PASSWORD and AUTH_SESSION_SECRET in .env.local."
  );
}

export const serverEnv = parsed.data;
