import "dotenv/config";
import express from "express";
import analyzeRouter from "./routes/analyze";

const app = express();
app.use(express.json({ limit: "1mb" }));

app.use("/analyze", analyzeRouter);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
