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

export const audienceRequestSchema = z.object({
  requestType: z.enum(requestTypes),
  source: z.enum(sourcePlatforms),
  request: z
    .string()
    .trim()
    .min(10, "Write at least 10 characters for the request.")
    .max(1500, "Keep the request under 1500 characters."),
  why: z
    .string()
    .trim()
    .min(5, "Write at least 5 characters for why it matters.")
    .max(1000, "Keep why it matters under 1000 characters."),
  context: z.string().trim().max(1000).optional().default(""),
  handle: z.string().trim().max(120).optional().default(""),
  website: z.string().trim().max(0).optional().default(""),
});

export type AudienceRequest = z.infer<typeof audienceRequestSchema>;
