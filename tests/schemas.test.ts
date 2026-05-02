import { describe, it, expect } from "vitest";
import { AnalysisRequestSchema, AnalysisResponseSchema } from "../src/schemas/analysis";

describe("AnalysisRequestSchema", () => {
  it("accepts a valid text of 100 chars", () => {
    const result = AnalysisRequestSchema.safeParse({ text: "a".repeat(100) });
    expect(result.success).toBe(true);
  });

  it("rejects text shorter than 50 chars", () => {
    const result = AnalysisRequestSchema.safeParse({ text: "a".repeat(49) });
    expect(result.success).toBe(false);
  });

  it("rejects text longer than 50000 chars", () => {
    const result = AnalysisRequestSchema.safeParse({ text: "a".repeat(50001) });
    expect(result.success).toBe(false);
  });

  it("rejects when text field is missing", () => {
    const result = AnalysisRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects when text is not a string", () => {
    const result = AnalysisRequestSchema.safeParse({ text: 42 });
    expect(result.success).toBe(false);
  });
});

describe("AnalysisResponseSchema", () => {
  const valid = { summary: "A summary.", actionItems: ["a", "b", "c"], wordCount: 10 };

  it("accepts a valid response with summary, 3 action items, and wordCount", () => {
    const result = AnalysisResponseSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects when actionItems has 2 items", () => {
    const result = AnalysisResponseSchema.safeParse({ ...valid, actionItems: ["a", "b"] });
    expect(result.success).toBe(false);
  });

  it("rejects when actionItems has 4 items", () => {
    const result = AnalysisResponseSchema.safeParse({ ...valid, actionItems: ["a", "b", "c", "d"] });
    expect(result.success).toBe(false);
  });

  it("rejects when wordCount is negative", () => {
    const result = AnalysisResponseSchema.safeParse({ ...valid, wordCount: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects when summary is empty", () => {
    const result = AnalysisResponseSchema.safeParse({ ...valid, summary: "" });
    expect(result.success).toBe(false);
  });
});
