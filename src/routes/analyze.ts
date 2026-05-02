import { Router, type Request, type Response } from "express";
import { AnalysisRequestSchema } from "../schemas/analysis";
import { analyzeText } from "../services/analyzer";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const result = AnalysisRequestSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid request", details: result.error.flatten() });
    return;
  }

  try {
    const analysis = await analyzeText(result.data.text);
    res.json(analysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

export default router;
