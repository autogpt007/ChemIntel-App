
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // OpenRouter Proxy Endpoint
  app.post("/api/ai/generate", async (req, res) => {
    const { model, prompt, systemInstruction } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "OPENROUTER_API_KEY is not configured in environment variables." });
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://ais-dev.run.app", // Required by OpenRouter
          "X-Title": "ChemIntel B2B Market Analyzer", // Optional
        },
        body: JSON.stringify({
          model: model || "google/gemini-2.0-pro-exp-02-05:free", // Default to high-quality free model on OpenRouter
          messages: [
            ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
            { role: "user", content: prompt }
          ],
          // Some models on OpenRouter support search, but it's model-dependent.
          // For now, we'll just pass the prompt.
        }),
      });

      const data = await response.json();
      if (data.error) {
        return res.status(400).json({ error: data.error });
      }

      const text = data.choices?.[0]?.message?.content || "";
      res.json({ text });
    } catch (error: any) {
      console.error("OpenRouter Error:", error);
      res.status(500).json({ error: "Failed to connect to OpenRouter." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the static files from dist
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
