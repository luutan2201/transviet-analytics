import { z } from "zod";

/**
 * Validated environment variables.
 * Never read process.env directly anywhere else in the codebase.
 * Adding a new external config value (e.g. LinkedIn API) only requires
 * extending this schema — no other file should need to change.
 */
const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("TransViet Analytics"),
  NEXT_PUBLIC_APPS_SCRIPT_URL: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().url().optional()
  ),
  NEXT_PUBLIC_APP_VERSION: z.string().default("1.0.0"),
  NEXT_PUBLIC_DEFAULT_YEAR: z.coerce.number().default(new Date().getFullYear()),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APPS_SCRIPT_URL: process.env.NEXT_PUBLIC_APPS_SCRIPT_URL,
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  NEXT_PUBLIC_DEFAULT_YEAR: process.env.NEXT_PUBLIC_DEFAULT_YEAR,
});

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration. Check your .env.local file.");
}

export const env = parsed.data;
