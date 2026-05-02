import { z } from "zod";

export const AnalysisRequestSchema = z.object({
  text: z.string().min(50).max(50000),
});

export const AnalysisResponseSchema = z.object({
  summary: z.string().min(1),
  actionItems: z.array(z.string().min(1)).length(3),
  wordCount: z.int().positive(),
});

export type AnalysisRequest = z.infer<typeof AnalysisRequestSchema>;
export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;
