import { z } from "zod";

export const requestTypes = [
  "video-request",
  "feature-request",
  "workflow-pain",
  "question",
] as const;

export const sourcePlatforms = [
  "instagram",
  "tiktok",
  "youtube",
  "x",
  "other",
] as const;

export const desiredOutcomes = [
  "make-video",
  "build-or-change",
  "answer-question",
  "not-sure",
] as const;

export const specificityLevels = [
  "rough-idea",
  "clear-request",
  "exact-change",
] as const;

export const audienceRequestSchema = z.object({
  requestType: z.enum(requestTypes),
  source: z.enum(sourcePlatforms),
  desiredOutcome: z.enum(desiredOutcomes),
  specificity: z.enum(specificityLevels),
  request: z.string().trim().min(10).max(1500),
  why: z.string().trim().min(5).max(1000),
  context: z.string().trim().max(1000).optional().default(""),
  handle: z.string().trim().max(120).optional().default(""),
  website: z.string().trim().max(0).optional().default(""),
});

export type AudienceRequest = z.infer<typeof audienceRequestSchema>;
