import Groq from "groq-sdk";
import { AnalysisResponseSchema, type AnalysisResponse } from "../schemas/analysis";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeText(text: string): Promise<AnalysisResponse> {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'Summarize the input in 2-3 sentences and extract exactly 3 concrete action items grounded in the text. Do not invent items not present in the source. Respond with JSON matching this exact shape: { "summary": string, "actionItems": string[] }.',
      },
      { role: "user", content: text },
    ],
  });

  const raw = JSON.parse(response.choices[0].message.content ?? "{}");
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return AnalysisResponseSchema.parse({ ...raw, wordCount });
}
