
import { GoogleGenAI } from "@google/genai";
import { MarketSegment, MarketSignal, HubIntel, ArbitrageOpportunity, MarketRisk, MarketEntity, Vendor, COAEntry, GeopoliticalImpact, SupplyChainData, SentimentSummary, ComplianceDossier, NewsArticle } from "../types";

export class GeminiService {
  private async callGeminiDirectly(prompt: string, model: string = "gemini-3-flash-preview", tools?: any[]): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not found");

    const genAI = new GoogleGenAI({ apiKey });
    const response = await genAI.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        tools: tools
      }
    });

    return response.text || "";
  }

  private async callBackend(prompt: string, model: string = "google/gemini-2.0-flash-001"): Promise<string> {
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch from AI backend");
      }
      
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("OpenRouter Proxy Error:", error);
      throw error;
    }
  }

  /**
   * UNIFIED GENERATE: Tries Google AI Studio first, falls back to OpenRouter.
   */
  private async unifiedGenerate(prompt: string, options?: { geminiModel?: string, openRouterModel?: string, useSearch?: boolean }): Promise<string> {
    try {
      const tools = options?.useSearch ? [{ googleSearch: {} }] : undefined;
      // Try Gemini Direct first (Free Tier)
      return await this.callGeminiDirectly(prompt, options?.geminiModel || "gemini-3-flash-preview", tools);
    } catch (error: any) {
      console.warn("Gemini Direct failed or quota exceeded, falling back to OpenRouter:", error.message);
      // Fallback to OpenRouter via backend
      // Using high-quality models on OpenRouter as requested
      return await this.callBackend(prompt, options?.openRouterModel || "google/gemini-2.0-pro-exp-02-05:free");
    }
  }

  /**
   * ROBUST JSON HARVESTER: Extracts JSON from a string that might contain conversational filler.
   */
  private extractJson(text: string): string {
    const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!jsonMatch) return text.replace(/```json|```/g, '').trim();
    return jsonMatch[0];
  }

  private async callWithRetry<T>(fn: () => Promise<T>, retries = 2, delay = 2000): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      const isRateLimit = error?.message?.includes('429') || error?.status === 429;
      if (retries > 0 && isRateLimit) {
        await new Promise(res => setTimeout(res, delay));
        return this.callWithRetry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  async analyzeSentiment(query: string): Promise<SentimentSummary> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`NEURAL SENTIMENT ANALYSIS: Analyze the current market sentiment for "${query}".
        Search for recent news, trade reports, and social signals.
        
        STRICT JSON SCHEMA:
        {
          "overallScore": number (0-100),
          "dominantTrend": "Bullish" | "Bearish" | "Stable",
          "keyDrivers": string[],
          "signals": [
            { "source": string, "headline": string, "sentiment": "Positive" | "Negative" | "Neutral", "impactScore": number (0-100), "date": string }
          ]
        }`, { openRouterModel: "anthropic/claude-3.5-sonnet", useSearch: true });
      try {
        return JSON.parse(this.extractJson(text || '{"overallScore": 50, "dominantTrend": "Stable", "keyDrivers": [], "signals": []}'));
      } catch (e) {
        return { overallScore: 50, dominantTrend: 'Stable', keyDrivers: [], signals: [] };
      }
    });
  }

  async getRegulatoryDossier(asset: string): Promise<ComplianceDossier> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`REGULATORY COMPLIANCE DOSSIER: Generate a comprehensive regulatory overview for "${asset}".
        Include frameworks like REACH (EU), TSCA (USA), GHS, and regional restrictions in APAC.
        
        STRICT JSON SCHEMA:
        {
          "assetName": "${asset}",
          "casNumber": string,
          "summary": string,
          "requirements": [
            { "id": string, "framework": string, "requirement": string, "status": "Compliant" | "Action Required" | "Under Review", "deadline": string, "impact": "High" | "Medium" | "Low", "description": string }
          ],
          "lastUpdated": "YYYY-MM-DD"
        }`, { openRouterModel: "openai/gpt-4o", useSearch: true });
      try {
        return JSON.parse(this.extractJson(text || '{"assetName": "", "casNumber": "", "summary": "", "requirements": [], "lastUpdated": ""}'));
      } catch (e) {
        return { assetName: asset, casNumber: 'N/A', summary: 'Failed to generate dossier.', requirements: [], lastUpdated: new Date().toLocaleDateString() };
      }
    });
  }

  async getMultiModelArbitrage(segment: MarketSegment): Promise<ArbitrageOpportunity[]> {
    return this.callWithRetry(async () => {
      // Council of Experts: Query two different models and merge
      const p1 = this.unifiedGenerate(`Identify 3 high-margin arbitrage opportunities for ${segment} chemicals. Focus on China-Europe-USA corridors.`, { openRouterModel: "anthropic/claude-3.5-sonnet" });
      const p2 = this.unifiedGenerate(`Identify 3 high-margin arbitrage opportunities for ${segment} chemicals. Focus on APAC-Middle East corridors.`, { openRouterModel: "deepseek/deepseek-chat" });
      
      const [r1, r2] = await Promise.all([p1, p2]);
      
      const prompt = `MERGE & VALIDATE ARBITRAGE SIGNALS:
        Signal Set A: ${r1}
        Signal Set B: ${r2}
        
        Task: Merge these into a single list of the 5 most viable opportunities. Remove duplicates. Normalize the data.
        
        STRICT JSON SCHEMA:
        [
          {
            "id": string,
            "asset": string,
            "buyRegion": string,
            "buyPrice": string,
            "sellRegion": string,
            "sellPrice": string,
            "margin": string,
            "profitPerTon": string,
            "volumePotential": string,
            "logisticsComplexity": "Low" | "Medium" | "High",
            "riskFactor": number (0-100),
            "reasoning": string,
            "lastUpdated": string
          }
        ]`;
        
      const mergedText = await this.unifiedGenerate(prompt, { openRouterModel: "google/gemini-2.0-pro-exp-02-05:free" });
      try {
        return JSON.parse(this.extractJson(mergedText || '[]'));
      } catch (e) {
        return [];
      }
    });
  }

  async getSupplyChainIntelligence(asset: string, region: string = 'Global'): Promise<SupplyChainData> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`NEURAL SUPPLY CHAIN MAPPING: Map the global supply chain for "${asset}" in ${region}.
        Identify raw material sources, major manufacturers, key distributors, and end-user segments.
        Assess the status of each node (Stable, At Risk, Disrupted) based on current global events.
        
        STRICT JSON SCHEMA:
        {
          "nodes": [
            { "id": string, "name": string, "type": "Raw Material" | "Manufacturer" | "Distributor" | "End User", "region": string, "status": "Stable" | "At Risk" | "Disrupted", "capacity": string }
          ],
          "links": [
            { "source": "node_id_1", "target": "node_id_2", "value": number, "riskLevel": "Low" | "Medium" | "High" }
          ]
        }`, { useSearch: true });
      try {
        return JSON.parse(this.extractJson(text || '{"nodes":[], "links":[]}'));
      } catch (e) {
        return { nodes: [], links: [] };
      }
    });
  }

  async getArbitrageOpportunities(segment: MarketSegment): Promise<ArbitrageOpportunity[]> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`ARBITRAGE INTELLIGENCE: Identify 5 high-margin arbitrage opportunities for ${segment} chemicals.
        Compare prices between major global hubs (e.g., China, Europe, USA, SE Asia).
        Focus on current market discrepancies caused by logistics, geopolitical shifts, or local supply shocks.
        
        STRICT JSON SCHEMA:
        [
          {
            "id": string,
            "asset": string,
            "buyRegion": string,
            "buyPrice": string,
            "sellRegion": string,
            "sellPrice": string,
            "margin": string,
            "profitPerTon": string,
            "volumePotential": string,
            "logisticsComplexity": "Low" | "Medium" | "High",
            "riskFactor": number (0-100),
            "reasoning": string,
            "lastUpdated": string
          }
        ]`, { useSearch: true });
      try {
        return JSON.parse(this.extractJson(text || '[]'));
      } catch (e) {
        return [];
      }
    });
  }

  async getGeopoliticalIntelligence(region: string = 'Global'): Promise<GeopoliticalImpact[]> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`GEOPOLITICAL MARKET RECON: Search for high-ranking chemical products in ${region} currently affected by geopolitical events (wars, trade sanctions, election results, policy shifts).
        
        STRICT JSON SCHEMA:
        [{
          "id": string,
          "productName": string,
          "impactLevel": "High" | "Medium" | "Low",
          "region": string,
          "reason": string,
          "priceChange": string,
          "supplyRisk": string,
          "sentiment": "Positive" | "Negative" | "Neutral",
          "lastUpdated": "YYYY-MM-DD"
        }]`, { useSearch: true });
      try {
        return JSON.parse(this.extractJson(text || '[]'));
      } catch (e) {
        return [];
      }
    });
  }

  async findCOAs(chemical: string, batch?: string, deepScan: boolean = false): Promise<COAEntry[]> {
    return this.callWithRetry(async () => {
      const isCasSearch = /^\d{2,7}-\d{2}-\d$/.test(chemical.trim());
      const model = deepScan ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview";
      const text = await this.unifiedGenerate(`NEURAL DOCUMENT SEARCH & RECON: Target asset "${chemical}" ${batch ? `Batch ${batch}` : ''}.
        
        CRITICAL INSTRUCTIONS:
        1. ${isCasSearch ? `STRICT CAS MATCHING REQUIRED: The target is a CAS number (${chemical}). First, resolve the exact chemical name for this CAS (e.g., 69708-36-7 is 2-Chloro-4-nitrobenzoic acid). Every result MUST explicitly contain this CAS number (${chemical}) AND be for this specific chemical. DO NOT return results for similar chemicals or different CAS numbers. If you find a COA for a different CAS, DISCARD IT.` : `STRICT ASSET MATCHING: Ensure the results are for "${chemical}".`}
        2. LINK VALIDATION: Only provide "originalPdfUrl" if it is a direct, publicly accessible link to a PDF. Do not provide broken or placeholder links.
        3. DATA INTEGRITY: Extract technical data points only from documents that match the target asset exactly.
        4. RECONSTRUCTION FALLBACK: If no exact match is found for the specific CAS/Batch, use your internal knowledge of the manufacturer's standard specifications for this EXACT chemical to reconstruct the digital twin. Ensure the specifications (Purity, Melting Point, Appearance, etc.) are accurate for this specific chemical. Set the "authenticityScore" lower (e.g., 70-80) and omit the "originalPdfUrl".
        
        STRICT JSON FORMAT:
        [{
          "id": string,
          "chemicalName": string,
          "casNumber": string,
          "batchNumber": string,
          "manufacturer": string,
          "purity": string,
          "issueDate": "YYYY-MM-DD",
          "expiryDate": "YYYY-MM-DD",
          "specifications": [{ "parameter": string, "unit": string, "specification": string, "actualResult": string }],
          "sourceUrl": "Primary metadata source URL",
          "originalPdfUrl": "DIRECT LINK TO ORIGINAL MANUFACTURER PDF (if found and verified)",
          "authenticityScore": number (0-100),
          "labName": "Name of the testing laboratory",
          "stampUrl": "URL to a digital representation of the lab stamp/seal if found"
        }]`, { geminiModel: model, useSearch: true });
      try {
        const results: COAEntry[] = JSON.parse(this.extractJson(text || '[]'));
        
        // Post-process: Strict filtering if it was a CAS search
        if (isCasSearch) {
          const targetCas = chemical.trim();
          return results.filter(r => r.casNumber.trim() === targetCas);
        }
        return results;
      } catch (e) {
        console.error("COA Parsing Error:", e);
        return [];
      }
    });
  }

  async generateRFQDraft(asset: string, vendor: Vendor, requirements: string): Promise<string> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`GENERATE PROFESSIONAL RFQ: Draft a formal Request for Quotation for "${asset}" to be sent to "${vendor.name}" (${vendor.country}).
        Include the following requirements: ${requirements}.
        The tone should be professional, authoritative, and include placeholders for specific commercial terms.
        Format as a clean, structured email/document.`, { geminiModel: "gemini-3-flash-preview", openRouterModel: "google/gemini-2.0-flash-lite-001" });
      return text || "Failed to generate RFQ draft.";
    });
  }

  async getQuickHubIntel(query: string, region: string = 'Global'): Promise<Partial<HubIntel>> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`QUICK ASSET IDENTIFICATION: "${query}" in ${region}.
        Provide: CAS number, cost, scarcity (0-10), advice, applications, pricing summary, substitution options, regulatory status, potential buyers, and import requirements for major countries in this region.
        
        STRICT JSON:
        {
          "assetName": "${query}",
          "casNumber": string,
          "currentCostPerTon": string,
          "globalScarcityIndex": number,
          "procurementAdvice": string,
          "pricingTrendSummary": string,
          "primaryApplications": string[],
          "substitutionOptions": string[],
          "regulatoryStatus": string,
          "buyers": [{ "name": string, "country": string, "annualVolume": string }],
          "importRequirements": [
            { "country": string, "requirements": string, "dutyEstimate": string }
          ]
        }`, { geminiModel: "gemini-3-flash-preview", openRouterModel: "google/gemini-2.0-flash-lite-001", useSearch: true });
      try {
        return JSON.parse(this.extractJson(text || '{}'));
      } catch (e) {
        return {};
      }
    });
  }

  async getDeepHubIntel(query: string, region: string = 'Global'): Promise<{ manufacturers: Vendor[] }> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`DEEP SUPPLIER RECON: "${query}" producers in ${region}. Find real emails.
        
        STRICT JSON:
        {
          "manufacturers": [{ "name": string, "country": string, "contact": { "email": string, "department": string }, "specialization": string, "annualCapacity": string }]
        }`, { useSearch: true });
      try {
        return JSON.parse(this.extractJson(text || '{"manufacturers": []}'));
      } catch (e) {
        return { manufacturers: [] };
      }
    });
  }

  async getOpportunitySignals(segment: MarketSegment, region: string = 'Global'): Promise<MarketSignal[]> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`Search trending chemical assets in ${segment} for ${region}. Price and Supply data.
        Also identify 2-3 specific high-volume buyer leads for each asset.
        
        JSON schema:
        Array of MarketSignal objects {
          id: string,
          chemicalName: string,
          demandTrend: "Up" | "Down",
          volatilityScore: number,
          opportunityScore: number,
          reasoning: string,
          priceEstimate: string,
          growthRate: string,
          globalInventory: string,
          buyers: [{
            id: string,
            name: string,
            country: string,
            annualVolume: string,
            contact: { email: string, department: string },
            purchasingTrends: number[] (array of 12 numbers representing monthly volume),
            preferredPaymentTerms: string,
            buyingHabits: string
          }]
        }`, { useSearch: true });
      try {
        return JSON.parse(this.extractJson(text || '[]'));
      } catch (e) {
        return [];
      }
    });
  }

  async getArbitrageIntelligence(region: string = 'Global'): Promise<ArbitrageOpportunity[]> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`Identify 3 regional price arbitrage opportunities for bulk chemicals involving ${region}.
        
        STRICT JSON SCHEMA:
        [{
          "asset": string,
          "buyRegion": string,
          "sellRegion": string,
          "margin": string,
          "volumePotential": string,
          "riskFactor": number (0-100)
        }]`, { geminiModel: "gemini-3-flash-preview", openRouterModel: "google/gemini-2.0-flash-lite-001" });
      try {
        return JSON.parse(this.extractJson(text || '[]'));
      } catch (e) {
        return [];
      }
    });
  }

  async getGlobalRiskMap(region: string = 'Global'): Promise<MarketRisk[]> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`Search for supply chain risks in ${region} (last 72h). JSON array of MarketRisk.`, { geminiModel: "gemini-3-flash-preview", openRouterModel: "google/gemini-2.0-flash-lite-001" });
      try {
        return JSON.parse(this.extractJson(text || '[]'));
      } catch (e) {
        return [];
      }
    });
  }

  async getLiveNewsFeed(region: string = 'Global'): Promise<NewsArticle[]> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`LIVE CHEMICAL MARKET NEWS RECON: Search for the most recent (last 24-48h) news, trade reports, and regulatory updates related to the chemical industry in ${region}.
        Focus on price shifts, plant shutdowns, supply chain disruptions, and major trade deals.
        
        STRICT JSON SCHEMA:
        [{
          "id": string,
          "title": string,
          "summary": string,
          "source": string,
          "url": string,
          "timestamp": "YYYY-MM-DD HH:mm",
          "impactScore": number (0-100),
          "sentiment": "Positive" | "Negative" | "Neutral",
          "relatedChemicals": string[],
          "region": string
        }]`, { geminiModel: "gemini-3-flash-preview", openRouterModel: "google/gemini-2.0-flash-lite-001", useSearch: true });
      try {
        return JSON.parse(this.extractJson(text || '[]'));
      } catch (e) {
        console.error("News Feed Parsing Error:", e);
        return [];
      }
    });
  }
}

export const geminiService = new GeminiService();
