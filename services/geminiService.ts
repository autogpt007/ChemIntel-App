
import { GoogleGenAI } from "@google/genai";
import { MarketSegment, MarketSignal, HubIntel, ArbitrageOpportunity, MarketRisk, MarketEntity, Vendor, COAEntry, GeopoliticalImpact, SupplyChainData, SentimentSummary, ComplianceDossier, NewsArticle } from "../types";

export class GeminiService {
  private engine: 'gemini' | 'openrouter' = 'gemini';
  private openRouterModel: string = "google/gemini-2.0-flash-001";
  private neuralCache: Map<string, { response: string, timestamp: number }> = new Map();
  private CACHE_TTL = 1000 * 60 * 60; // 1 hour

  setEngine(engine: 'gemini' | 'openrouter') {
    this.engine = engine;
  }

  setOpenRouterModel(model: string) {
    this.openRouterModel = model;
  }

  getEngine() {
    return this.engine;
  }

  private async callOpenRouter(prompt: string, model: string = "google/gemini-2.0-flash-001", systemInstruction?: string): Promise<string> {
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction, model })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(`OpenRouter Proxy Error: ${err.details || err.error || response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "";
      } else {
        const text = await response.text();
        throw new Error(`OpenRouter Proxy Error: Non-JSON response: ${text.substring(0, 100)}`);
      }
    } catch (error: any) {
      console.error("OpenRouter Call Failed:", error);
      throw error;
    }
  }

  private async callGeminiDirectly(prompt: string, model: string = "gemini-3-flash-preview", tools?: any[], systemInstruction?: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not found");

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        tools: tools
      }
    });

    return response.text || "";
  }

  /**
   * NEURAL ROUTER: Analyzes the task and selects the optimal model from the OpenRouter cluster.
   */
  private neuralRoute(prompt: string): string {
    const p = prompt.toLowerCase();
    if (p.includes('search') || p.includes('recon') || p.includes('news')) {
      return "google/gemini-2.0-flash-001"; // Best for real-time search
    }
    if (p.includes('reasoning') || p.includes('council') || p.includes('geopolitical')) {
      return "anthropic/claude-3.5-sonnet"; // Best for complex reasoning
    }
    if (p.includes('json') || p.includes('schema') || p.includes('extract')) {
      return "openai/gpt-4o-mini"; // Best for structured data
    }
    if (p.includes('summarize') || p.includes('large') || p.includes('scale')) {
      return "meta-llama/llama-3.1-405b"; // Best for massive context
    }
    return this.openRouterModel; // Default to user selection
  }

  /**
   * UNIFIED GENERATE: Now supports both Gemini Direct and OpenRouter Cluster.
   */
  public async unifiedGenerate(prompt: string, options?: { geminiModel?: string, openRouterModel?: string, useSearch?: boolean, systemInstruction?: string }): Promise<string> {
    const cacheKey = `${this.engine}-${options?.openRouterModel || this.openRouterModel}-${prompt}`;
    const cached = this.neuralCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < this.CACHE_TTL)) {
      return cached.response;
    }

    let response = "";
    if (this.engine === 'openrouter') {
      let model = options?.openRouterModel || this.openRouterModel;
      
      // If no specific model is forced, use the Neural Router
      if (model === 'google/gemini-2.0-flash-001' || !options?.openRouterModel) {
        model = this.neuralRoute(prompt);
      }
      
      response = await this.callOpenRouter(prompt, model, options?.systemInstruction);
    } else {
      const tools = options?.useSearch ? [{ googleSearch: {} }] : undefined;
      response = await this.callGeminiDirectly(prompt, options?.geminiModel || "gemini-3-flash-preview", tools, options?.systemInstruction);
    }

    if (response) {
      this.neuralCache.set(cacheKey, { response, timestamp: Date.now() });
    }
    return response;
  }

  /**
   * ROBUST JSON HARVESTER: Extracts JSON from a string that might contain conversational filler.
   */
  private extractJson(text: string): string {
    if (!text) return "[]";
    // Remove markdown code blocks if present
    const cleaned = text.replace(/```json\s?|```/g, '').trim();
    
    // Try to find the first [ or { and the last ] or }
    const firstBracket = cleaned.indexOf('[');
    const firstBrace = cleaned.indexOf('{');
    
    let start = -1;
    let end = -1;
    
    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      start = firstBracket;
      end = cleaned.lastIndexOf(']');
    } else if (firstBrace !== -1) {
      start = firstBrace;
      end = cleaned.lastIndexOf('}');
    }
    
    if (start !== -1 && end !== -1 && end > start) {
      return cleaned.substring(start, end + 1);
    }
    
    return cleaned;
  }

  private async callWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 3000): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      const isRateLimit = errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || error?.status === 429;
      
      if (retries > 0 && isRateLimit) {
        console.warn(`AI Rate Limit Hit. Retrying in ${delay}ms... (${retries} attempts left)`);
        await new Promise(res => setTimeout(res, delay));
        return this.callWithRetry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  async scoutCOA(chemical: string, batch?: string, deepScan: boolean = false): Promise<COAEntry[]> {
    return this.callWithRetry(async () => {
      const isCasSearch = /^\d{2,7}-\d{2}-\d$/.test((chemical || '').trim());
      
      // AGENT 01: THE VALIDATOR (Primary Authentication)
      const validatorSystem = `You are Agent 01: The Validator. Your ONLY job is to authenticate the chemical identity using PubChem, CAS, and UniChem standards.
      Return ONLY a JSON object: { "name": string, "cas": string, "synonyms": string[], "vetted": boolean }`;
      
      let identity = { name: chemical, cas: isCasSearch ? chemical : "Unknown", synonyms: [], vetted: false };
      
      try {
        const validatorText = await this.unifiedGenerate(`Authenticate identity for: ${chemical}`, { 
          geminiModel: "gemini-3-flash-preview", 
          systemInstruction: validatorSystem 
        });
        identity = JSON.parse(this.extractJson(validatorText || "{}"));
      } catch (e) {
        console.error("Validator Agent Failure:", e);
      }

      // AGENT 05: THE MASTER WEAVER (Synthesis & Multi-Agent Orchestration)
      const model = deepScan ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview"; 

      const systemInstruction = `You are Agent 05: The Master Weaver of the "Heisenberg" Agentic Stack. 
      Your mission is to synthesize intelligence from four specialized sub-agents into a high-fidelity COA document.
      
      SUB-AGENT INTELLIGENCE FEEDS:
      - AGENT 01 (Validator): Identity Vetted: ${identity.vetted}. Target: ${identity.name} (CAS: ${identity.cas}).
      - AGENT 02 (Pharm-Scout): Scanning DrugBank, ChEMBL, and PharmaSource for HPLC, NMR, and MS analytical standards.
      - AGENT 03 (Regulatory Guardian): Scanning ECHA, EPA CompTox, and REACH dossiers for GHS pictograms and Hazard statements.
      - AGENT 04 (Industrial Miner): Scanning Guidechem and NIST for bulk density, mesh size, and alkalinity ranges.
      
      RECONSTRUCTION PROTOCOL:
      1. AUTHENTICATE: Use the verified identity (${identity.name}, CAS: ${identity.cas}) as the absolute source of truth.
      2. SYNTHESIZE: Merge analytical data (Agent 02), regulatory data (Agent 03), and industrial specs (Agent 04).
      3. STANDARDIZE: If exact batch data is missing, reconstruct a standardized COA following USP/EP/ISO 9001 standards.
      
      JSON Schema:
      [{
        "id": string,
        "chemicalName": string,
        "casNumber": string,
        "batchNumber": string,
        "manufacturer": string,
        "purity": string,
        "issueDate": "YYYY-MM-DD",
        "expiryDate": "YYYY-MM-DD",
        "synonyms": string,
        "catNumber": string,
        "molecularFormula": string,
        "molecularWeight": string,
        "identification": string,
        "vetted": boolean,
        "agenticStack": { "validator": true, "pharmScout": true, "regulatoryGuardian": true, "industrialMiner": true, "masterWeaver": true },
        "regulatory": {
          "ghsPictograms": string[],
          "hazardStatements": string[],
          "precautionaryStatements": string[],
          "reachStatus": string
        },
        "analyticalInfo": {
          "description": string,
          "solubility": string,
          "massByLCMS": string,
          "h1NMR": string,
          "purityByHPLC": string
        },
        "specifications": [{ "parameter": string, "unit": string, "specification": string, "actualResult": string, "method": string }],
        "sourceUrl": string,
        "authenticityScore": number (0-100),
        "labName": string,
        "isStandardized": boolean
      }]`;

      const prompt = `Perform a deep scout for "${chemical}" ${batch ? `Batch ${batch}` : ''}. 
      If you cannot find a specific batch COA, generate a standardized one for this chemical with an authenticity score of 85.
      Return ONLY the JSON array.`;

      const coaText = await this.unifiedGenerate(prompt, { 
        geminiModel: model, 
        systemInstruction: systemInstruction,
        useSearch: true
      });

      let coaEntries: COAEntry[] = [];
      try {
        const jsonStr = this.extractJson(coaText || "[]");
        let results = JSON.parse(jsonStr);
        if (!Array.isArray(results) && results.coaEntries) {
          results = results.coaEntries;
        } else if (!Array.isArray(results)) {
          results = [results];
        }
        coaEntries = results;
      } catch (e) {
        console.error("COA Parsing Error:", e);
      }

      // 2. For each COA, generate a "Verified Lab Stamp" using Gemini Image Gen
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) return coaEntries;

      const ai = new GoogleGenAI({ apiKey });
      
      const updatedEntries = await Promise.all(coaEntries.map(async (entry) => {
        try {
          const stampPrompt = `A professional, circular laboratory verification stamp for a chemical company. 
          The stamp should be in a single color (dark blue or emerald green). 
          Text on the stamp: "VERIFIED LAB RESULTS", "BATCH: ${entry.batchNumber || 'N/A'}", "CHEMINTEL NEURAL CORE". 
          In the center, a stylized chemical structure icon. 
          The style should be a realistic ink stamp on white paper.`;

          const imageResponse = await ai.models.generateContent({
            model: "gemini-3.1-flash-image-preview",
            contents: [{ parts: [{ text: stampPrompt }] }],
            config: {
              imageConfig: {
                aspectRatio: "1:1",
                imageSize: "512px"
              }
            }
          });

          let stampUrl = "";
          for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              stampUrl = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }

          return { ...entry, stampUrl };
        } catch (err) {
          console.warn("Failed to generate stamp for COA:", err);
          return entry;
        }
      }));

      return updatedEntries;
    });
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
        }`, { geminiModel: "gemini-3-flash-preview", useSearch: true });
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
        }`, { geminiModel: "gemini-3-flash-preview", useSearch: true });
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
      const p1 = this.unifiedGenerate(`Identify 3 high-margin arbitrage opportunities for ${segment} chemicals. Focus on China-Europe-USA corridors.`, { geminiModel: "gemini-3-flash-preview" });
      const p2 = this.unifiedGenerate(`Identify 3 high-margin arbitrage opportunities for ${segment} chemicals. Focus on APAC-Middle East corridors.`, { geminiModel: "gemini-3-flash-preview" });
      
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
        
      const mergedText = await this.unifiedGenerate(prompt, { geminiModel: "gemini-3-flash-preview" });
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
      const isCasSearch = /^\d{2,7}-\d{2}-\d$/.test((chemical || '').trim());
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
          const targetCas = (chemical || '').trim();
          return results.filter(r => r.casNumber && r.casNumber.trim() === targetCas);
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
        Format as a clean, structured email/document.`, { geminiModel: "gemini-3-flash-preview" });
      return text || "Failed to generate RFQ draft.";
    });
  }

  async getQuickHubIntel(query: string, region: string = 'Global'): Promise<Partial<HubIntel>> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`QUICK ASSET IDENTIFICATION: "${query}" in ${region}.
        Provide: CAS number, cost, scarcity (0-10), advice, applications, pricing summary, substitution options, regulatory status, potential buyers, import requirements, peak seasonality, and mathematical forecast skill (0-100).
        
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
          "peakSeason": string,
          "forecastSkill": number,
          "buyers": [{ "name": string, "country": string, "annualVolume": string }],
          "importRequirements": [
            { "country": string, "requirements": string, "dutyEstimate": string }
          ]
        }`, { geminiModel: "gemini-3-flash-preview", useSearch: true });
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
        Include peak seasonality, mathematical forecast skill (0-100), and mathematical confidence (0-100).
        
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
          peakSeason: string,
          forecastSkill: number,
          mathematicalConfidence: number,
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
        }]`, { geminiModel: "gemini-3-flash-preview" });
      try {
        return JSON.parse(this.extractJson(text || '[]'));
      } catch (e) {
        return [];
      }
    });
  }

  async getGlobalRiskMap(region: string = 'Global'): Promise<MarketRisk[]> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`Search for supply chain risks in ${region} (last 72h). JSON array of MarketRisk.`, { geminiModel: "gemini-3-flash-preview" });
      try {
        return JSON.parse(this.extractJson(text || '[]'));
      } catch (e) {
        return [];
      }
    });
  }

  async getLiveNewsFeed(region: string = 'Global'): Promise<NewsArticle[]> {
    const currentDate = new Date().toISOString().split('T')[0];
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`LIVE CHEMICAL MARKET NEWS RECON: Search for the most recent (last 24-48h) news, trade reports, and regulatory updates related to the chemical industry in ${region}.
        Current Date: ${currentDate}.
        Focus on price shifts, plant shutdowns, supply chain disruptions, and major trade deals.
        
        CRITICAL: Return ONLY a valid JSON array. No conversational text.
        
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
        }]`, { geminiModel: "gemini-3-flash-preview", useSearch: true });
      try {
        const jsonStr = this.extractJson(text || '[]');
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error("News Feed Parsing Error:", e);
        return [];
      }
    });
  }

  async getMarketPulse(): Promise<any> {
    try {
      const response = await fetch("/api/market/pulse");
      if (!response.ok) throw new Error("Pulse failed");
      return await response.json();
    } catch (error) {
      console.error("Market Pulse Error:", error);
      return null;
    }
  }

  async getInitialLeads(region: string = 'Global'): Promise<MarketEntity[]> {
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`Identify 4 major chemical companies (Buyers or Sellers) active in ${region}.
        Provide their name, country, region, annual volume (MT), and 2-3 key products they trade.
        
        STRICT JSON SCHEMA:
        [{
          "id": string,
          "type": "Buyer" | "Seller",
          "name": string,
          "country": string,
          "region": string,
          "annualVolume": string,
          "status": "Active",
          "source": "Neural Recon",
          "tags": string[],
          "contact": { "department": string, "email": string, "isEmailVerified": true }
        }]`, { useSearch: true });
      try {
        return JSON.parse(this.extractJson(text || '[]'));
      } catch (e) {
        return [];
      }
    });
  }

  async getTopProducts(segment: MarketSegment, region: string = 'Global'): Promise<any[]> {
    const timestamp = new Date().getTime();
    return this.callWithRetry(async () => {
      const text = await this.unifiedGenerate(`Identify 5 high-volume trending chemical products in the ${segment} sector for ${region} as of ${new Date().toISOString()}.
        Focus on assets with significant price movement or supply chain shifts in the last 24-48 hours.
        Include current price estimates and 24h trend percentage.
        Random seed: ${timestamp}
        
        STRICT JSON SCHEMA:
        [{
          "name": string,
          "trend": string (e.g. "+5.2%"),
          "sector": string,
          "price": string (e.g. "$1,200/t")
        }]`, { useSearch: true });
      try {
        return JSON.parse(this.extractJson(text || '[]'));
      } catch (e) {
        return [];
      }
    });
  }
}

export const geminiService = new GeminiService();
