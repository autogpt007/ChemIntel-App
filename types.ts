
export enum MarketSegment {
  PETROCHEMICALS = 'Petrochemicals',
  SPECIALTY_CHEMICALS = 'Specialty Chemicals',
  AGROCHEMICALS = 'Agrochemicals',
  PHARMA_INGREDIENTS = 'API/Pharmaceuticals',
  POLYMERS = 'Polymers & Plastics',
  INORGANICS = 'Inorganic Chemicals',
  BIO_BASED = 'Bio-based Chemicals',
  INDUSTRIAL_GASES = 'Industrial Gases'
}

export interface IntegrationNode {
  id: string;
  name: string;
  status: 'Operational' | 'Degraded' | 'Offline' | 'Synchronized';
  type: 'Market' | 'Grounding' | 'Logistics' | 'Regulatory' | 'Custom';
  tier?: string;
  lastSync?: string;
}

export interface SystemConfig {
  aiModel: 'gemini-3-flash-preview' | 'gemini-3-pro-preview';
  aiEngine: 'gemini' | 'openrouter';
  openRouterModel: string;
  temperature: number;
  thinkingBudget: number;
  scrapingDepth: number;
  autoSeeding: boolean;
  cachePersistence: boolean;
  integrationNodes: IntegrationNode[];
  echemiAuth: {
    status: 'Connected' | 'Disconnected' | 'Authenticating';
    accountTier: 'Pro' | 'Enterprise' | 'Free';
    tokenExpiry?: string;
    username?: string;
  };
  geoFencing: string[];
}

export interface ArbitrageOpportunity {
  id: string;
  asset: string;
  buyRegion: string;
  buyPrice: string;
  sellRegion: string;
  sellPrice: string;
  margin: string;
  profitPerTon: string;
  volumePotential: string;
  logisticsComplexity: 'Low' | 'Medium' | 'High';
  riskFactor: number; // 0-100
  reasoning: string;
  lastUpdated: string;
}

export interface MarketRisk {
  region: string;
  impactLevel: 'Critical' | 'Moderate' | 'Low';
  cause: string;
  affectedAssets: string[];
  consequences: string;
}

export interface EntityContact {
  department: string;
  email: string;
  name?: string;
  phone?: string;
  linkedIn?: string;
  isEmailVerified: boolean;
  lastVerified?: string;
}

export interface MarketEntity {
  id: string;
  type: 'Buyer' | 'Seller' | 'Manufacturer';
  name: string;
  country: string;
  region: string;
  annualVolume: string;
  contact: EntityContact;
  status: 'Active' | 'Contracting' | 'Identifying';
  financialTier?: string;
  source: 'Echemi' | 'Neural' | 'Manual';
  purityRequirements?: string;
  purchasingTrends?: number[];
  tags: string[];
  chemicalFocus?: string;
}

export interface Vendor extends MarketEntity {
  specialization: string;
  annualCapacity?: string;
  sellingHabits?: string;
  certifications?: string[];
}

export interface BuyerLead extends MarketEntity {
  buyingHabits?: string;
  preferredPaymentTerms?: string;
}

export interface HubIntel {
  assetName: string;
  casNumber: string;
  currentCostPerTon: string;
  projectedCostQ4: string;
  globalScarcityIndex: number;
  manufacturers: Vendor[];
  buyers: BuyerLead[];
  substitutionOptions: string[];
  procurementAdvice: string;
  regulatoryStatus: string;
  lastUpdated: string;
  pricingTrendSummary?: string;
  primaryApplications?: string[];
  marketStatus?: string;
  supplyLevel?: string;
  priceIndex?: number;
  summary?: string;
  category?: MarketSegment;
  technicalSpecs?: { label: string; value: string }[];
  importRequirements?: { country: string; requirements: string; dutyEstimate: string }[];
  peakSeason?: string;
  forecastSkill?: number; // 0-100
}

export interface COASpecification {
  parameter: string;
  unit: string;
  specification: string;
  actualResult: string;
  method?: string;
}

export interface COAEntry {
  id: string;
  chemicalName: string;
  casNumber: string;
  batchNumber: string;
  manufacturer: string;
  purity: string;
  issueDate: string;
  expiryDate: string;
  specifications: COASpecification[];
  sourceUrl: string;
  originalPdfUrl?: string;
  authenticityScore: number; // 0-100
  labName?: string;
  stampUrl?: string;
  isStandardized?: boolean;
  vetted?: boolean;
  agenticStack?: {
    validator: boolean;
    pharmScout: boolean;
    regulatoryGuardian: boolean;
    industrialMiner: boolean;
    masterWeaver: boolean;
  };
  regulatory?: {
    ghsPictograms: string[];
    hazardStatements: string[];
    precautionaryStatements: string[];
    reachStatus?: string;
  };
  synonyms?: string;
  catNumber?: string;
  molecularFormula?: string;
  molecularWeight?: string;
  identification?: string;
  analyticalInfo?: {
    description?: string;
    solubility?: string;
    massByLCMS?: string;
    h1NMR?: string;
    purityByHPLC?: string;
  };
}

export interface MarketSignal {
  id: string;
  chemicalName: string;
  segment: MarketSegment;
  demandTrend: 'Up' | 'Down' | 'Stable';
  volatilityScore: number;
  opportunityScore: number;
  reliabilityScore: number; 
  reasoning: string;
  priceEstimate: string;
  projectedCostQ4: string;
  predictionHorizon: string;
  growthRate: string;
  mainDemographic: string;
  globalInventory: 'Critically Low' | 'Low' | 'Moderate' | 'High';
  buyers?: BuyerLead[];
  peakSeason?: string;
  forecastSkill?: number; // 0-100
  mathematicalConfidence?: number; // 0-100
}

export interface GeopoliticalImpact {
  id: string;
  productName: string;
  impactLevel: 'High' | 'Medium' | 'Low';
  region: string;
  reason: string;
  priceChange: string;
  supplyRisk: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  lastUpdated: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  timestamp: string;
  impactScore: number; // 0-100
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  relatedChemicals: string[];
  region: string;
}

export interface NeuralProcessLog {
  id?: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'NEURAL';
  message: string;
  status?: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';
  type?: 'Market' | 'Grounding' | 'Logistics' | 'Regulatory' | 'Custom';
  agent?: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  agent?: string;
  content: string;
  timestamp: string;
  status?: 'thinking' | 'complete' | 'error';
  thoughtStream?: string[];
  metadata?: {
    confidence?: number;
    sources?: string[];
    mathModel?: string;
  };
}

export interface AgentStats {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Idle' | 'Thinking' | 'Offline';
  tasksCompleted: number;
  accuracy: number;
  neuralLoad: number;
  lastTask?: string;
  uptime: string;
}

export interface AgentTask {
  id: string;
  agentId: string;
  type: 'Market' | 'Document' | 'Compliance' | 'Logistics' | 'Regulatory';
  status: 'Pending' | 'Running' | 'Completed' | 'Failed';
  description: string;
  timestamp: string;
  result?: any;
}

export interface NeuralCouncilState {
  messages: AgentMessage[];
  activeAgents: string[];
  isThinking: boolean;
  agentStats: AgentStats[];
}

export interface SentimentSignal {
  source: string;
  headline: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  impactScore: number;
  date: string;
}

export interface SentimentSummary {
  overallScore: number; // 0-100
  dominantTrend: 'Bullish' | 'Bearish' | 'Stable';
  keyDrivers: string[];
  signals: SentimentSignal[];
}

export interface RegulatoryRequirement {
  id: string;
  framework: string; // e.g., REACH, TSCA, GHS
  requirement: string;
  status: 'Compliant' | 'Action Required' | 'Under Review';
  deadline?: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface ComplianceDossier {
  assetName: string;
  casNumber: string;
  requirements: RegulatoryRequirement[];
  summary: string;
  lastUpdated: string;
}

export interface MarketForecast {
  date: string;
  price: number;
}

export interface ForecastData {
  month: string;
  demand: number;
  supply: number;
  price: number;
  confidence: [number, number]; 
}

export interface SupplyChainNode {
  id: string;
  name: string;
  type: 'Raw Material' | 'Manufacturer' | 'Distributor' | 'End User';
  region: string;
  status: 'Stable' | 'At Risk' | 'Disrupted';
  capacity?: string;
  x?: number;
  y?: number;
}

export interface SupplyChainLink {
  source: string;
  target: string;
  value: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface RFQItem {
  assetName: string;
  casNumber?: string;
  quantity: string;
  purityRequirement?: string;
  targetPrice?: string;
  deliveryDate?: string;
}

export interface RFQ {
  id: string;
  subject: string;
  items: RFQItem[];
  vendorId: string;
  vendorName: string;
  status: 'Draft' | 'Sent' | 'Negotiating' | 'Accepted' | 'Rejected';
  draftContent: string;
  createdAt: string;
  lastUpdated: string;
}

export interface SupplyChainData {
  nodes: SupplyChainNode[];
  links: SupplyChainLink[];
}
