import { z } from "zod";

export const kpiTargetRawSchema = z.object({
  metric: z.string(),
  target: z.coerce.number().nonnegative(),
  periodType: z.enum(["month", "quarter", "year"]).default("month"),
  month: z.coerce.number().int().min(1).max(12).nullable().optional(),
  quarter: z.coerce.number().int().min(1).max(4).nullable().optional(),
  year: z.coerce.number().int(),
  enabled: z.boolean().default(true),
});

export const kpiApiDataSchema = z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  metrics: z.array(kpiTargetRawSchema),
});

export const kpiApiResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional().default(""),
  version: z.string(),
  updatedAt: z.string(),
  executionTime: z.number().optional(),
  data: kpiApiDataSchema,
});

export type KpiTargetRaw = z.infer<typeof kpiTargetRawSchema>;
export type KpiApiResponse = z.infer<typeof kpiApiResponseSchema>;
