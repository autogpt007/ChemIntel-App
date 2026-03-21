
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { NeuralEngine } from "./services/neuralEngine";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  const neuralEngine = new NeuralEngine();

  app.use(cors());
  app.use(express.json());

  // Neural Sentiment Analysis Endpoint
  app.post("/api/neural/sentiment", (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });
    
    const sentiment = neuralEngine.analyzeSentiment(text);
    const keywords = neuralEngine.extractKeywords(text);
    
    res.json({ sentiment, keywords });
  });

  // Live Market Pulse Endpoint (Simulates real-time data streams)
  app.get("/api/market/pulse", (req, res) => {
    const segments = ["Petrochemicals", "Specialty Chemicals", "Agrochemicals", "API/Pharmaceuticals"];
    const regions = ["Global", "APAC", "Europe", "North America"];
    
    const pulse = {
      timestamp: new Date().toISOString(),
      neuralLoad: 35 + Math.random() * 30,
      activeSignals: 12 + Math.floor(Math.random() * 8),
      globalSentiment: 65 + (Math.random() * 10 - 5),
      recentEvents: [
        { 
          id: Math.random().toString(36).substr(2, 9),
          type: "PRICE_SHIFT",
          asset: "Methanol",
          change: "+2.4%",
          region: "APAC",
          severity: "Medium"
        },
        { 
          id: Math.random().toString(36).substr(2, 9),
          type: "SUPPLY_ALERT",
          asset: "Phenol",
          status: "Tightening",
          region: "Europe",
          severity: "High"
        }
      ]
    };
    
    res.json(pulse);
  });

  // OpenRouter Proxy Endpoint
  app.post("/api/ai/generate", async (req, res) => {
    const { prompt, systemInstruction, model } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "OPENROUTER_API_KEY not configured on server" });
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://chemintel.b2b",
          "X-Title": "ChemIntel B2B",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model || "google/gemini-2.0-flash-001",
          messages: [
            { role: "system", content: systemInstruction || "You are a helpful assistant." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          top_p: 0.95
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error:", errorText);
        return res.status(response.status).json({ error: "OpenRouter API Error", details: errorText });
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        res.json(data);
      } else {
        const text = await response.text();
        console.error("OpenRouter Non-JSON Response:", text);
        res.status(500).json({ error: "OpenRouter returned non-JSON response", details: text });
      }
    } catch (error: any) {
      console.error("OpenRouter Proxy Error:", error);
      res.status(500).json({ error: "Internal Server Error", message: error.message });
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
