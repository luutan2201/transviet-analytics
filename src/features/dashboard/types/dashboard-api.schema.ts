import { z } from "zod";

/**
 * Raw wire schema — must mirror 33_API_CONTRACT.md exactly.
 * Nothing outside the Repository layer should ever import this file.
 */
export const weeklyMetricSchema = z.object({
  week: z.string(),
  month: z.coerce.number().int().min(1).max(12),
  quarter: z.coerce.number().int().min(1).max(4),
  year: z.coerce.number().int(),
  reach: z.coerce.number().nonnegative().default(0),
  impressions: z.coerce.number().nonnegative().default(0),
  followers: z.coerce.number().nonnegative().default(0),
  newFollowers: z.coerce.number().nonnegative().default(0),
  reactions: z.coerce.number().nonnegative().default(0),
  comments: z.coerce.number().nonnegative().default(0),
  shares: z.coerce.number().nonnegative().default(0),
  clicks: z.coerce.number().nonnegative().default(0),
  videoViews: z.coerce.number().nonnegative().default(0),
});

export const dashboardSummarySchema = z.object({
  reach: z.coerce.number().nonnegative().default(0),
  impressions: z.coerce.number().nonnegative().default(0),
  followers: z.coerce.number().nonnegative().default(0),
  newFollowers: z.coerce.number().nonnegative().default(0),
  reactions: z.coerce.number().nonnegative().default(0),
  comments: z.coerce.number().nonnegative().default(0),
  shares: z.coerce.number().nonnegative().default(0),
  clicks: z.coerce.number().nonnegative().default(0),
  videoViews: z.coerce.number().nonnegative().default(0),
});

export const dashboardApiDataSchema = z.object({
  summary: dashboardSummarySchema,
  weekly: z.array(weeklyMetricSchema),
  monthly: z.array(weeklyMetricSchema),
  quarterly: z.array(weeklyMetricSchema),
  yearly: z.array(weeklyMetricSchema),
});

export const apiBaseResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional().default(""),
  version: z.string(),
  updatedAt: z.string(),
  executionTime: z.number().optional(),
  data: dashboardApiDataSchema,
});

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errorCode: z.string(),
  timestamp: z.string(),
});

export type WeeklyMetricRaw = z.infer<typeof weeklyMetricSchema>;
export type DashboardSummaryRaw = z.infer<typeof dashboardSummarySchema>;
export type DashboardApiResponse = z.infer<typeof apiBaseResponseSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
