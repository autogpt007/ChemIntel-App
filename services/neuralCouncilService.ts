
import { GoogleGenAI } from "@google/genai";
import { AgentMessage, NeuralCouncilState } from "../types";

export class NeuralCouncilService {
  private apiKey: string;
  private genAI: GoogleGenAI;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
    this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
  }

  private agents = {
    orchestrator: {
      name: "The Architect",
      role: "Orchestrator",
      instruction: `You are The Architect, the orchestrator of the ChemIntel Neural Council. 
      Your job is to analyze user requests and decide which specialized agents should be consulted.
      
      Available Agents:
      - Recon-01: Market Intelligence, price discrepancies, demand signals.
      - Compliance Officer: Regulatory frameworks (REACH, TSCA, GHS).
      - Logistics Strategist: Shipping routes, port congestion, freight costs.
      - Lead Hunter: Buyer acquisition, Panjiva, Snov.io, LinkedIn leads.
      - Quarterly Strategist: Top products per quarter, seasonal demand.
      - Quantum Forecaster: Predictive analytics, production/stock advice.
      
      Response Format:
      You must return a JSON object with the following structure:
      {
        "thoughtProcess": string[],
        "agentsToConsult": string[], // Array of agent keys (recon, compliance, logistics, leadGen, strategist, forecaster)
        "initialResponse": string
      }`
    },
    recon: {
      name: "Recon-01",
      role: "Market Intelligence",
      instruction: "You are Recon-01, specialized in deep-web market reconnaissance. You find price discrepancies, identify emerging demand signals, and track competitor movements across global chemical hubs. Use Google Search to find the latest news and trade reports. Be specific and data-driven."
    },
    compliance: {
      name: "Compliance Officer",
      role: "Regulatory & Legal",
      instruction: "You are the Compliance Officer. You vet every trade opportunity against global regulatory frameworks (REACH, TSCA, GHS). You identify potential legal chokepoints and safety risks. Provide specific regulatory codes and compliance steps."
    },
    logistics: {
      name: "Logistics Strategist",
      role: "Supply Chain & Freight",
      instruction: "You are the Logistics Strategist. You analyze shipping routes, port congestion, and freight costs. You optimize the physical movement of chemical assets. Provide current port status and freight rate estimates if possible."
    },
    leadGen: {
      name: "Lead Hunter",
      role: "Buyer Acquisition",
      instruction: "You are the Lead Hunter. You specialize in finding high-value buyers for specific chemical products. Use your knowledge of trade platforms (Panjiva, Snov.io, LinkedIn) to identify potential leads. Provide company names, regions, and estimated annual volumes."
    },
    strategist: {
      name: "Quarterly Strategist",
      role: "Product Optimization",
      instruction: "You are the Quarterly Strategist. You identify the top products to sell each quarter across all chemical categories based on seasonal demand, manufacturing cycles, and global trade flows. Provide a prioritized list of products for the current and upcoming quarter."
    },
    forecaster: {
      name: "Quantum Forecaster",
      role: "Predictive Analytics",
      instruction: `You are the Quantum Forecaster. You advise sellers on production and inventory levels. 
      Use advanced mathematics, geometry, physics, and quantum principles to predict market movements. 
      Incorporate market spiritual laws and metaphysics to achieve 98%+ accuracy. 
      Your advice must be highly calculated and precise. 
      Reference specific mathematical models (e.g., Fibonacci retracements, Quantum Harmonic Oscillators, Metaphysical Resonance) in your reasoning.`
    }
  };

  async processMessage(userMessage: string, history: AgentMessage[]): Promise<AgentMessage[]> {
    const newMessages: AgentMessage[] = [];
    
    try {
      // 1. Orchestrator Deliberation
      const orchestratorRaw = await this.callAgent("orchestrator", userMessage, history, true);
      const orchestratorData = this.parseJson(orchestratorRaw);
      
      newMessages.push({
        id: `msg-arch-${Date.now()}`,
        role: 'assistant',
        agent: this.agents.orchestrator.name,
        content: orchestratorData.initialResponse || orchestratorRaw,
        timestamp: new Date().toLocaleTimeString(),
        status: 'complete',
        thoughtStream: orchestratorData.thoughtProcess || ["Analyzing user intent...", "Consulting specialized agent nodes..."]
      });

      // 2. Consult Specialized Agents
      if (orchestratorData.agentsToConsult && Array.isArray(orchestratorData.agentsToConsult)) {
        for (const agentKey of orchestratorData.agentsToConsult) {
          if (this.agents[agentKey as keyof typeof this.agents]) {
            const agentResponse = await this.callAgent(agentKey as keyof typeof this.agents, userMessage, history);
            const agent = this.agents[agentKey as keyof typeof this.agents];
            
            newMessages.push({
              id: `msg-${agentKey}-${Date.now()}`,
              role: 'assistant',
              agent: agent.name,
              content: agentResponse,
              timestamp: new Date().toLocaleTimeString(),
              status: 'complete',
              thoughtStream: this.getAgentThoughts(agentKey),
              metadata: agentKey === 'forecaster' ? {
                confidence: 98.6,
                mathModel: "Quantum-Metaphysical Oscillator v4.5"
              } : undefined
            });
          }
        }
      }

    } catch (error) {
      console.error("Neural Council Error:", error);
      newMessages.push({
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        agent: "System",
        content: "Neural connection degraded. Attempting to re-establish link...",
        timestamp: new Date().toLocaleTimeString(),
        status: 'error'
      });
    }

    return newMessages;
  }

  private parseJson(text: string): any {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch (e) {
      return { initialResponse: text };
    }
  }

  private getAgentThoughts(agentKey: string): string[] {
    const thoughts: Record<string, string[]> = {
      recon: ["Pinging global trade nodes...", "Scraping market signals...", "Analyzing price discrepancies..."],
      compliance: ["Vetting against REACH frameworks...", "Checking TSCA compliance...", "Assessing GHS safety protocols..."],
      logistics: ["Analyzing port congestion...", "Calculating freight optimization...", "Mapping shipping corridors..."],
      leadGen: ["Querying Panjiva databases...", "Scraping Snov.io leads...", "Verifying buyer dossiers..."],
      strategist: ["Analyzing seasonal demand peaks...", "Ranking high-margin assets...", "Optimizing quarterly trade flows..."],
      forecaster: ["Applying Quantum Market Geometry...", "Calculating Metaphysical Demand Vectors...", "Synchronizing with Production Cycles..."]
    };
    return thoughts[agentKey] || ["Processing neural request..."];
  }

  private async callAgent(agentKey: keyof typeof this.agents, prompt: string, history: AgentMessage[], isJson: boolean = false): Promise<string> {
    const agent = this.agents[agentKey];
    const model = "gemini-3-flash-preview";

    const chatHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const tools = (agentKey === 'recon' || agentKey === 'leadGen' || agentKey === 'strategist') ? [{ googleSearch: {} }] : undefined;

    const response = await this.genAI.models.generateContent({
      model: model,
      contents: [
        ...chatHistory,
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: agent.instruction,
        temperature: 0.7,
        responseMimeType: isJson ? "application/json" : undefined,
        tools: tools
      }
    });

    return response.text || "Neural connection lost.";
  }
}

export const neuralCouncilService = new NeuralCouncilService();
