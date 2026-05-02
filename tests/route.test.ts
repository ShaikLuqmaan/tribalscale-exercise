import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import analyzeRouter from "../src/routes/analyze";
import { analyzeText } from "../src/services/analyzer";

vi.mock("../src/services/analyzer.js", () => ({
  analyzeText: vi.fn(),
}));

const app = express();
app.use(express.json());
app.use("/analyze", analyzeRouter);

const mockResponse = { summary: "Test summary", actionItems: ["a", "b", "c"], wordCount: 10 };

beforeEach(() => {
  vi.mocked(analyzeText).mockResolvedValue(mockResponse);
});

describe("POST /analyze", () => {
  it("returns 200 and the mocked response for valid text", async () => {
    const res = await request(app).post("/analyze").send({ text: "a".repeat(100) });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResponse);
  });

  it("returns 400 when text is under 50 chars", async () => {
    const res = await request(app).post("/analyze").send({ text: "short" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 for empty body", async () => {
    const res = await request(app).post("/analyze").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 500 when analyzeText throws", async () => {
    vi.mocked(analyzeText).mockRejectedValue(new Error("Groq failure"));
    const res = await request(app).post("/analyze").send({ text: "a".repeat(100) });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Analysis failed" });
  });
});
