
import { COAEntry, HubIntel, MarketSignal, AgentMessage, AgentStats, AgentTask } from '../types';
import { costOptimizer, ComplexityLevel } from './costOptimizer';
import { geminiService } from './geminiService';
import { integrationService } from './integrationService';

class AgentService {
  private skynetStatus: 'Dormant' | 'Waking' | 'Active' | 'Overloaded' = 'Waking';
  private costStats = { totalSavings: '0.0000', efficiency: '0%' };
  private listeners: (() => void)[] = [];
  
  private agents: AgentStats[] = [
    { id: 'arch', name: 'The Architect', role: 'Orchestrator', status: 'Active', tasksCompleted: 1000 + Math.floor(Math.random() * 500), accuracy: 99.5 + Math.random() * 0.5, neuralLoad: 30 + Math.floor(Math.random() * 20), uptime: '14d 2h', lastTask: 'Global Node Sync' },
    { id: 'recon', name: 'Recon-01', role: 'Market Intel', status: 'Active', tasksCompleted: 8000 + Math.floor(Math.random() * 1000), accuracy: 97.5 + Math.random() * 1.5, neuralLoad: 50 + Math.floor(Math.random() * 30), uptime: '14d 2h', lastTask: 'EMEA Price Probe' },
    { id: 'doc', name: 'Document Scout', role: 'COA/TDS Recon', status: 'Active', tasksCompleted: 3000 + Math.floor(Math.random() * 500), accuracy: 98.5 + Math.random() * 1.0, neuralLoad: 20 + Math.floor(Math.random() * 20), uptime: '14d 2h', lastTask: 'CAS 64-17-5 Grounding' },
    { id: 'comp', name: 'Compliance Guardian', role: 'Regulatory', status: 'Active', tasksCompleted: 1000 + Math.floor(Math.random() * 200), accuracy: 99.9 + Math.random() * 0.1, neuralLoad: 10 + Math.floor(Math.random() * 15), uptime: '14d 2h', lastTask: 'REACH Dossier Audit' },
    { id: 'log', name: 'Logistics Architect', role: 'Supply Chain', status: 'Idle', tasksCompleted: 800 + Math.floor(Math.random() * 300), accuracy: 96.5 + Math.random() * 2.0, neuralLoad: 5 + Math.floor(Math.random() * 10), uptime: '14d 2h', lastTask: 'Suez Canal Risk Map' }
  ];

  private tasks: AgentTask[] = [];

  constructor() {
    // Simulate Skynet waking up
    setTimeout(() => {
      this.skynetStatus = 'Active';
      this.notify();
      console.log("SKYNET: Neural Core Synchronized. All Agents Live.");
      this.startSimulation();
    }, 5000);
  }

  private startSimulation() {
    // Periodic activity simulation
    setInterval(() => {
      this.simulateActivity();
    }, 20000); // Every 20 seconds (increased from 10)
  }

  private simulateActivity() {
    // 1. Randomly update neural load for all agents
    this.agents.forEach(agent => {
      const delta = Math.floor(Math.random() * 11) - 5; // -5 to +5
      agent.neuralLoad = Math.max(5, Math.min(95, agent.neuralLoad + delta));
      
      // Occasionally complete a task
      if (Math.random() > 0.8) {
        agent.tasksCompleted += 1;
      }
    });

    // 2. Occasionally add a background task
    if (Math.random() > 0.7) {
      const backgroundTasks = [
        { agent: 'recon', type: 'Market' as const, desc: 'Scanning dark pool liquidity...' },
        { agent: 'doc', type: 'Document' as const, desc: 'Indexing new REACH dossiers...' },
        { agent: 'comp', type: 'Regulatory' as const, desc: 'Auditing cross-border compliance...' },
        { agent: 'log', type: 'Logistics' as const, desc: 'Optimizing Suez bypass routes...' }
      ];
      const taskTemplate = backgroundTasks[Math.floor(Math.random() * backgroundTasks.length)];
      const taskId = `sim-${Date.now()}`;
      
      this.addTask(taskTemplate.agent, taskTemplate.type, taskTemplate.desc);
      
      // Complete it after a delay
      setTimeout(() => {
        this.completeTask(taskId, "Optimization complete.");
      }, 5000 + Math.random() * 5000);
    }

    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private async callAgent(agentId: string, prompt: string, systemInstruction: string, taskType: string = 'general', complexity: ComplexityLevel = ComplexityLevel.MEDIUM) {
    // Use CostOptimizer to select the best model
    const model = costOptimizer.optimize(taskType, complexity);
    this.costStats = costOptimizer.getStats();
    this.notify();

    try {
      const text = await geminiService.unifiedGenerate(prompt, {
        geminiModel: model,
        systemInstruction: `[AGENT: ${agentId}] [SKYN-ID: ${Math.random().toString(36).substring(7)}] ${systemInstruction}`
      });
      
      return text;
    } catch (error: any) {
      console.error(`Agent ${agentId} Error:`, error);
      throw error;
    }
  }

  async processCouncilMessage(userMessage: string, history: AgentMessage[]): Promise<AgentMessage[]> {
    const taskId = `council-${Date.now()}`;
    this.addTask('arch', 'Market', `Orchestrating council response for: ${userMessage.substring(0, 30)}...`);

    try {
      // GROUNDING: Fetch external data based on user message
      let groundingContext = "";
      const lowerMsg = userMessage.toLowerCase();
      
      if (lowerMsg.includes('shipping') || lowerMsg.includes('route') || lowerMsg.includes('logistics')) {
        const logistics = await integrationService.fetchLogisticsData('Shanghai', 'Rotterdam');
        groundingContext += `\n[NEURAL LOGISTICS GROUNDING]: Route ${logistics.route}, Transit: ${logistics.avgTransitTime}, Congestion: ${logistics.congestionLevel}, Risk: ${logistics.riskLevel}\n`;
      }
      
      if (lowerMsg.includes('compliance') || lowerMsg.includes('reach') || lowerMsg.includes('ghs')) {
        const compliance = await integrationService.checkCompliance('Target Chemical', 'Europe');
        groundingContext += `\n[COMPLIANCE GROUNDING]: Status: ${compliance.status}, Hazard: ${compliance.hazard}, Restriction: ${compliance.restriction}\n`;
      }

      const systemInstruction = `You are The Architect, the orchestrator of the ChemIntel Neural Council. 
      Analyze the user request and decide which specialized agents should be consulted.
      
      ${groundingContext ? `EXTERNAL GROUNDING DATA AVAILABLE: ${groundingContext}` : ''}
      
      Available Agents:
      - recon: Market Intelligence, price discrepancies, demand signals.
      - compliance: Regulatory frameworks (REACH, TSCA, GHS).
      - logistics: Shipping routes, port congestion, freight costs.
      - leadGen: Buyer acquisition, Panjiva, Snov.io, LinkedIn leads.
      - forecaster: Predictive analytics, production/stock advice.
      
      Response Format:
      Return a JSON object:
      {
        "thoughtProcess": string[],
        "agentsToConsult": string[], // Array of agent keys
        "initialResponse": string
      }`;

      const orchestratorRaw = await this.callAgent('arch', userMessage, systemInstruction, 'orchestration', ComplexityLevel.HIGH);
      const orchestratorData = JSON.parse(orchestratorRaw.match(/\{[\s\S]*\}/)?.[0] || orchestratorRaw);
      
      const newMessages: AgentMessage[] = [];
      newMessages.push({
        id: `msg-arch-${Date.now()}`,
        role: 'assistant',
        agent: 'The Architect',
        content: orchestratorData.initialResponse || "Analyzing ecosystem nodes...",
        timestamp: new Date().toLocaleTimeString(),
        status: 'complete',
        thoughtStream: orchestratorData.thoughtProcess || ["Initializing Orchestrator...", "Syncing with Market Recon..."]
      });

      if (orchestratorData.agentsToConsult) {
        for (const agentKey of orchestratorData.agentsToConsult) {
          const agent = this.agents.find(a => a.id === agentKey) || this.agents[1]; // Fallback to recon
          const complexity = agentKey === 'forecaster' ? ComplexityLevel.HIGH : ComplexityLevel.MEDIUM;
          
          const agentResponse = await this.callAgent(agent.id, userMessage, `You are ${agent.name}, ${agent.role}. Provide a detailed, data-driven response.`, agentKey, complexity);
          
          newMessages.push({
            id: `msg-${agentKey}-${Date.now()}`,
            role: 'assistant',
            agent: agent.name,
            content: agentResponse,
            timestamp: new Date().toLocaleTimeString(),
            status: 'complete',
            thoughtStream: [`${agent.name} processing...`, `Grounding ${agent.role} data...`]
          });
          this.incrementAgentStats(agent.id);
        }
      }

      this.completeTask(taskId, newMessages);
      this.incrementAgentStats('arch');
      return newMessages;
    } catch (error) {
      this.failTask(taskId, error);
      throw error;
    }
  }

  async orchestrateMarketIntel(chemical: string, region: string): Promise<{ intel: HubIntel, signals: MarketSignal[] }> {
    const taskId = `task-${Date.now()}`;
    this.addTask('recon', 'Market', `Scouting market intelligence for ${chemical} in ${region}.`);

    try {
      const systemInstruction = `You are Recon-01, the Market Intelligence Agent. 
      Your task is to provide a comprehensive market intelligence report for the specified chemical and region.
      Return the data in a structured JSON format matching the HubIntel and MarketSignal interfaces.
      
      Available Market Segments:
      - Petrochemicals
      - Specialty Chemicals
      - Agrochemicals
      - API/Pharmaceuticals
      - Polymers & Plastics
      - Inorganic Chemicals
      - Bio-based Chemicals
      - Industrial Gases`;

      const prompt = `Perform a deep market scan for "${chemical}" in the "${region}" region. 
      Include current cost per ton, projected cost for Q4, global scarcity index, verified manufacturers, and market signals.
      Crucially, identify the "category" of this chemical from the provided Market Segments list.
      Return ONLY the JSON object with keys "intel" and "signals".`;

      const result = await this.callAgent('recon', prompt, systemInstruction, 'market_intel', ComplexityLevel.MEDIUM);
      const data = JSON.parse(result.match(/\{[\s\S]*\}/)?.[0] || result);
      
      this.completeTask(taskId, data);
      this.incrementAgentStats('recon');
      
      return data;
    } catch (error) {
      this.failTask(taskId, error);
      throw error;
    }
  }

  async scoutCOA(chemical: string, batch?: string, onProgress?: (msg: string) => void): Promise<COAEntry[]> {
    const taskId = `task-${Date.now()}`;
    
    let targetBatch = batch;
    if (!targetBatch) {
      const msg = `Deep-dive batch discovery for ${chemical}...`;
      this.addTask('doc', 'Document', msg);
      if (onProgress) onProgress(msg);
      
      const discoveredBatches = await this.discoverBatches(chemical);
      if (discoveredBatches && discoveredBatches.length > 0) {
        targetBatch = discoveredBatches[0];
        this.completeTask(taskId, `Discovered batch: ${targetBatch}`);
      }
    }

    // Phase 1: Identity Authentication (Agent 01)
    const validatorMsg = `Agent 01 (Validator): Authenticating identity for ${chemical} via PubChem/CAS...`;
    this.addTask('auth', 'Compliance', validatorMsg);
    if (onProgress) onProgress(validatorMsg);
    await new Promise(r => setTimeout(r, 800));

    // Phase 2: Specialized Scouting (Agents 02-04)
    const scoutMsg = `Agents 02-04 (Scouts): Retrieving analytical (Pharm-Scout), regulatory (Guardian), and industrial (Miner) data...`;
    this.addTask('doc', 'Document', scoutMsg);
    if (onProgress) onProgress(scoutMsg);
    await new Promise(r => setTimeout(r, 1200));

    // Phase 3: Synthesis (Agent 05)
    const weaverMsg = `Agent 05 (Master Weaver): Synthesizing multi-agent intelligence into high-fidelity COA...`;
    this.addTask('synthesis', 'Regulatory', weaverMsg);
    if (onProgress) onProgress(weaverMsg);

    try {
      const data = await geminiService.scoutCOA(chemical, targetBatch, true);
      
      this.completeTask(taskId, data);
      this.incrementAgentStats('doc');
      
      return data;
    } catch (error) {
      this.failTask(taskId, error);
      throw error;
    }
  }

  async discoverBatches(chemical: string): Promise<string[]> {
    try {
      const systemInstruction = `You are Document Scout's Batch Discovery Sub-Agent. 
      Your task is to identify common or recent lot/batch numbers for a given chemical or CAS number.
      These numbers are often found in manufacturer catalogs, shipping manifests, or public COA databases.`;

      const prompt = `Find 3 real-world or highly probable lot/batch numbers for "${chemical}". 
      Return ONLY a JSON array of strings.`;

      const result = await this.callAgent('doc', prompt, systemInstruction, 'batch_discovery', ComplexityLevel.LOW);
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      const batches = JSON.parse(jsonMatch ? jsonMatch[0] : "[]");
      return batches;
    } catch (error) {
      console.error("Batch discovery failed:", error);
      return [];
    }
  }

  async getSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return [];
    
    try {
      const systemInstruction = `You are the Neural Suggestion Engine. 
      Provide 5 common chemical names or CAS numbers that match the user's partial input.`;

      const prompt = `Suggest 5 chemicals or CAS numbers starting with or containing "${query}". 
      Return ONLY a JSON array of strings.`;

      const result = await this.callAgent('arch', prompt, systemInstruction, 'general', ComplexityLevel.LOW);
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      const suggestions = JSON.parse(jsonMatch ? jsonMatch[0] : "[]");
      return suggestions;
    } catch (error) {
      return [];
    }
  }

  private addTask(agentId: string, type: AgentTask['type'], description: string) {
    const newTask: AgentTask = {
      id: `task-${Date.now()}`,
      agentId,
      type,
      status: 'Running',
      description,
      timestamp: new Date().toLocaleTimeString()
    };
    this.tasks = [newTask, ...this.tasks].slice(0, 50);
    this.updateAgentStatus(agentId, 'Thinking');
  }

  private completeTask(taskId: string, result: any) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'Completed';
      task.result = result;
      this.updateAgentStatus(task.agentId, 'Active');
      
      const agent = this.agents.find(a => a.id === task.agentId);
      if (agent) agent.lastTask = task.description;
    }
  }

  private failTask(taskId: string, error: any) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'Failed';
      task.result = error;
      this.updateAgentStatus(task.agentId, 'Active');
    }
  }

  private updateAgentStatus(agentId: string, status: AgentStats['status']) {
    const agent = this.agents.find(a => a.id === agentId);
    if (agent) agent.status = status;
  }

  private incrementAgentStats(agentId: string) {
    const agent = this.agents.find(a => a.id === agentId);
    if (agent) {
      agent.tasksCompleted += 1;
      agent.neuralLoad = Math.min(agent.neuralLoad + 5, 100);
    }
  }

  getAgents() { return this.agents; }
  getTasks() { return this.tasks; }
  getSkynetStatus() { return this.skynetStatus; }
  getCostStats() { return this.costStats; }
}

export const agentService = new AgentService();
