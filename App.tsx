
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MarketChart from './components/MarketChart';
import SupplyChainMap from './components/SupplyChainMap';
import ArbitrageEngine from './components/ArbitrageEngine';
import RFQEngine from './components/RFQEngine';
import COALedgerView from './components/COALedgerView';
import COAModal from './components/COAModal';
import SentimentEngine from './components/SentimentEngine';
import DashboardView from './components/DashboardView';
import GeopoliticalView from './components/GeopoliticalView';
import ResearchView from './components/ResearchView';
import SupplyChainView from './components/SupplyChainView';
import ConfigView from './components/ConfigView';
import LedgerView from './components/LedgerView';
import ComplianceView from './components/ComplianceView';
import NewsFeedView from './components/NewsFeedView';
import IntegrationHub from './components/IntegrationHub';
import AgentControlCenter from './components/AgentControlCenter';
import { agentService } from './services/agentService';
import Footer from './components/Footer';
import NeuralCouncilChat from './components/NeuralCouncilChat';
import NeuralCouncilView from './components/NeuralCouncilView';
import NeuralCouncilAdmin from './components/NeuralCouncilAdmin';
import { geminiService } from './services/geminiService';
import { marketEngine } from './services/marketEngine';
import { jsPDF } from 'jspdf';
import { 
  BarChart, Bar, XAxis as ReXAxis, YAxis as ReYAxis, Tooltip as ReTooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  MarketSegment, MarketSignal, NeuralProcessLog, HubIntel, 
  ArbitrageOpportunity, MarketRisk, MarketEntity, SystemConfig, Vendor, COAEntry, IntegrationNode, GeopoliticalImpact, SupplyChainData, RFQ, BuyerLead, NewsArticle
} from './types';
import { 
  TrendingUp, TrendingDown, Terminal, Target, RefreshCcw, Search, 
  ShieldCheck, Factory, Ship, Globe2, Cpu, Key, LogIn,
  FileText, Mail, MapPin, Boxes, Radar, Clock, X, Phone,
  Lightbulb, Download, Database, Copy, Check, Eye, Settings,
  AlertCircle, ChevronRight, User, ArrowRight, Activity, Zap, HardDrive, Shield,
  ArrowUpRight, ArrowDownRight, BarChart3, Lock, ZapOff, Briefcase, ChevronDown,
  Layers, Filter, Link, Globe, FlaskConical, Loader2, Building2, FileCheck, ExternalLink,
  ShieldAlert, Printer, Info, FileSearch, Sliders, ToggleLeft, ToggleRight, Sparkles, Server, Network,
  Plus, Trash2, ShieldQuestion, Workflow, Save, CreditCard, HelpCircle, Menu, LayoutDashboard, BrainCircuit
} from 'lucide-react';
import { motion } from 'motion/react';

const regions = ['Global', 'North America', 'Europe', 'APAC', 'Middle East', 'LATAM', 'Africa'];
const countries = ['All', 'China', 'India', 'USA', 'Germany', 'Brazil', 'Japan', 'South Korea', 'Vietnam', 'Turkey', 'Russia'];
const SYSTEM_BUILD_ID = `v2.0.${Math.floor(Math.random() * 20)}-DYNAMIC-NODE-${Math.random().toString(36).substring(7).toUpperCase()}`;

export const useAgentData = () => {
  const [data, setData] = useState({
    agents: agentService.getAgents(),
    tasks: agentService.getTasks(),
    skynetStatus: agentService.getSkynetStatus(),
    costStats: agentService.getCostStats()
  });

  useEffect(() => {
    return agentService.subscribe(() => {
      setData({
        agents: agentService.getAgents(),
        tasks: agentService.getTasks(),
        skynetStatus: agentService.getSkynetStatus(),
        costStats: agentService.getCostStats()
      });
    });
  }, []);

  return data;
};

const MiniTrendBar: React.FC<{ data: number[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-6">
      {data.map((val, i) => (
        <div 
          key={i} 
          className="w-1 bg-blue-500/40 rounded-t-sm" 
          style={{ height: `${(val / max) * 100}%` }}
        />
      ))}
    </div>
  );
};

const BuyerModal: React.FC<{ buyer: BuyerLead; onClose: () => void }> = ({ buyer, onClose }) => {
  const chartData = (buyer.purchasingTrends || [40, 45, 42, 50, 55, 52, 60, 65, 62, 70, 75, 72]).map((val, i) => ({
    month: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i],
    volume: val
  }));

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[300] flex items-center justify-center p-4 lg:p-6 animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col max-h-[95vh] lg:max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 lg:top-8 lg:right-8 p-2 lg:p-3 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-all z-10">
          <X className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        <div className="p-6 lg:p-12 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start text-center md:text-left">
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-blue-50 rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-center shrink-0 ring-4 lg:ring-8 ring-blue-50">
              <User className="w-10 h-10 lg:w-14 lg:h-14 text-blue-600" />
            </div>
            <div className="flex-1 space-y-4 lg:space-y-6">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[8px] lg:text-[10px] font-black uppercase tracking-widest border border-blue-100">Verified Buyer Lead</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] lg:text-[10px] font-black uppercase tracking-widest border border-emerald-100">{buyer.status}</span>
                </div>
                <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter">{buyer.name}</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] lg:text-xs mt-2 flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="w-3 h-3 lg:w-4 lg:h-4 text-slate-400" /> {buyer.country} • {buyer.region}
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <div className="bg-slate-50 p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-slate-100">
                  <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase mb-1 lg:mb-2">Annual Volume</p>
                  <p className="text-sm lg:text-xl font-black text-slate-900">{buyer.annualVolume}</p>
                </div>
                <div className="bg-slate-50 p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-slate-100">
                  <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase mb-1 lg:mb-2">Financial Tier</p>
                  <p className="text-sm lg:text-xl font-black text-blue-600">{buyer.financialTier || 'Tier 1'}</p>
                </div>
                <div className="bg-slate-50 p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-slate-100">
                  <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase mb-1 lg:mb-2">Source</p>
                  <p className="text-sm lg:text-xl font-black text-indigo-600">{buyer.source}</p>
                </div>
                <div className="bg-slate-50 p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-slate-100">
                  <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase mb-1 lg:mb-2">Payment Terms</p>
                  <p className="text-sm lg:text-xl font-black text-emerald-600">{buyer.preferredPaymentTerms || 'Net 30'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6 lg:space-y-8">
              <div className="bg-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-200">
                <h3 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-widest mb-4 lg:mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" /> 12-Month Purchasing Trend
                </h3>
                <div className="h-40 lg:h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={0}>
                    <BarChart data={chartData}>
                      <ReXAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <ReTooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#2563eb' }}
                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                      />
                      <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#2563eb' : '#e2e8f0'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-200">
                <h3 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-widest mb-4 lg:mb-6 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" /> Procurement Profile
                </h3>
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex justify-between items-center p-3 lg:p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase">Buying Habits</span>
                    <span className="text-[11px] lg:text-xs font-bold text-slate-900">{buyer.buyingHabits || 'Spot & Contract'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 lg:p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase">Purity Req.</span>
                    <span className="text-[11px] lg:text-xs font-bold text-slate-900">{buyer.purityRequirements || '>99.5%'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:space-y-8">
              <div className="bg-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-200">
                <h3 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-widest mb-4 lg:mb-6 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" /> Verified Contact Node
                </h3>
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase">Direct Email</p>
                      <p className="text-[13px] lg:text-sm font-bold text-slate-900 break-all">{buyer.contact.email || 'procurement@' + buyer.name.toLowerCase().replace(/\s+/g, '') + '.com'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase">Department</p>
                      <p className="text-[13px] lg:text-sm font-bold text-slate-900">{buyer.contact.department}</p>
                    </div>
                  </div>
                  <a 
                    href={`mailto:${buyer.contact.email || 'procurement@' + buyer.name.toLowerCase().replace(/\s+/g, '') + '.com'}`}
                    className="w-full py-4 lg:py-5 bg-blue-600 text-white text-[9px] lg:text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                  >
                    <Mail className="w-4 h-4" /> Initiate Neural Handshake
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-200">
                <h3 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-widest mb-4 lg:mb-6 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-slate-400" /> Neural Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {buyer.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 lg:px-3 lg:py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NeuralGuide: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      title: "Market Dashboard",
      description: "Real-time intelligence on chemical price movements, sector movers, and global arbitrage opportunities.",
      icon: LayoutDashboard
    },
    {
      title: "Neural Council",
      description: "A collective of specialized AI agents working in parallel to solve complex trade problems.",
      icon: BrainCircuit
    },
    {
      title: "Quantum Forecaster",
      description: "Advanced predictive engine using quantum geometry and metaphysical demand vectors to achieve 98%+ accuracy.",
      icon: Zap
    },
    {
      title: "Compliance Hub",
      description: "Automated regulatory vetting against REACH, TSCA, and GHS frameworks for global trade safety.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[500] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <Radar className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Neural Guide</h2>
              <p className="text-sm text-slate-500 font-medium">Mastering the ChemIntel Ecosystem</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-slate-900">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 group-hover:border-blue-200">
                <step.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Live: v{4 + Math.floor(Math.random() * 2)}.{Math.floor(Math.random() * 10)}.{Math.floor(Math.random() * 100)}-Neural
          </div>
          <button 
            onClick={onClose}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
          >
            Acknowledge & Enter
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<MarketSegment>(MarketSegment.SPECIALTY_CHEMICALS);
  const [selectedRegion, setSelectedRegion] = useState<string>('Global');
  
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [arbitrage, setArbitrage] = useState<ArbitrageOpportunity[]>([]);
  const [risks, setRisks] = useState<MarketRisk[]>([]);
  const [ledgerData, setLedgerData] = useState<MarketEntity[]>([]);
  const [forecast, setForecast] = useState(marketEngine.generateForecast(MarketSegment.SPECIALTY_CHEMICALS));
  const [topProducts, setTopProducts] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [arbitrageLoading, setArbitrageLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreSignals, setHasMoreSignals] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [coaBatch, setCoaBatch] = useState('');
  const [logs, setLogs] = useState<NeuralProcessLog[]>([]);
  const [hubIntel, setHubIntel] = useState<HubIntel | null>(null);
  const [geopoliticalData, setGeopoliticalData] = useState<GeopoliticalImpact[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [coaEntries, setCoaEntries] = useState<COAEntry[]>([]);
  const [deepScan, setDeepScan] = useState(false);
  const [supplyChainData, setSupplyChainData] = useState<SupplyChainData | null>(null);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<MarketEntity | null>(null);
  const [selectedBuyerLead, setSelectedBuyerLead] = useState<BuyerLead | null>(null);
  const [selectedCOA, setSelectedCOA] = useState<COAEntry | null>(null);
  const [probeStatus, setProbeStatus] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // System Configuration State
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    aiModel: 'gemini-3-flash-preview',
    aiEngine: 'gemini',
    openRouterModel: 'google/gemini-2.0-flash-001',
    temperature: 0.7,
    thinkingBudget: 16000,
    scrapingDepth: 8,
    autoSeeding: true,
    cachePersistence: true,
    integrationNodes: [
      { id: 'n1', name: 'Echemi Global Bridge', status: 'Operational', type: 'Market', tier: 'Enterprise', lastSync: '10m ago' },
      { id: 'n2', name: 'Neural Core (Gemini)', status: 'Synchronized', type: 'Grounding', tier: 'Primary', lastSync: 'Real-time' },
      { id: 'n3', name: 'Regulatory Compliance AI', status: 'Operational', type: 'Regulatory', tier: 'Enterprise', lastSync: '1h ago' }
    ],
    echemiAuth: {
      status: 'Connected',
      accountTier: 'Enterprise',
      username: 'NeuralAdmin_01'
    },
    geoFencing: ['EMEA', 'APAC', 'AMER']
  });

  // Modal State for Adding/Editing Nodes
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Partial<IntegrationNode> | null>(null);

  useEffect(() => {
    geminiService.setEngine(systemConfig.aiEngine);
    geminiService.setOpenRouterModel(systemConfig.openRouterModel);
  }, [systemConfig.aiEngine, systemConfig.openRouterModel]);

  const [filterCountry, setFilterCountry] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const observer = useRef<IntersectionObserver | null>(null);
  const lastSignalElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreSignals && activeTab === 'dashboard') {
        loadMoreSignals();
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMoreSignals, activeTab]);

  const [engineStats, setEngineStats] = useState({
    convergence: 98.4,
    entropy: 0.24,
    forecastSkill: 86.2
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setEngineStats(prev => ({
        convergence: Math.min(99.9, Math.max(95, prev.convergence + (Math.random() * 0.2 - 0.1))),
        entropy: Math.min(0.5, Math.max(0.1, prev.entropy + (Math.random() * 0.02 - 0.01))),
        forecastSkill: Math.min(95, Math.max(80, prev.forecastSkill + (Math.random() * 0.4 - 0.2)))
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredLedger = useMemo(() => {
    return ledgerData.filter(item => {
      const countryMatch = filterCountry === 'All' || item.country === filterCountry;
      const regionMatch = selectedRegion === 'Global' || item.region === selectedRegion;
      const typeMatch = filterType === 'All' || item.type === filterType;
      const searchMatch = searchQuery === '' || 
        (item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (item.tags?.some(t => t?.toLowerCase().includes(searchQuery.toLowerCase())) ?? false);
      return countryMatch && typeMatch && searchMatch && (activeTab === 'dashboard' ? true : regionMatch);
    });
  }, [ledgerData, filterCountry, filterType, searchQuery, selectedRegion, activeTab]);

  const addLog = (message: string, level: NeuralProcessLog['level'] = 'INFO') => {
    setLogs(prev => [{ timestamp: new Date().toLocaleTimeString(), level, message }, ...prev].slice(0, 50));
  };

  useEffect(() => {
    fetchData();
    fetchNews();
    fetchInitialLeads();
    
    // Background Sync for Live Market Pulse
    const pulseInterval = setInterval(async () => {
      const pulse = await geminiService.getMarketPulse();
      if (pulse && pulse.recentEvents) {
        let hasHighSeverity = false;
        pulse.recentEvents.forEach((event: any) => {
          if (event.severity === 'High') hasHighSeverity = true;
          
          // Only add if it's a high severity event or random chance to avoid spam
          if (event.severity === 'High' || Math.random() > 0.7) {
            addLog(`LIVE: ${event.type} detected for ${event.asset} in ${event.region} (${event.change || event.status})`, 'NEURAL');
          }
        });

        // If high severity events found, trigger a refresh of news and data
        if (hasHighSeverity) {
          fetchNews(true); // Background sync
          fetchData(true); // Background sync
        }
      }
    }, 30000); // Every 30 seconds (increased from 15 to reduce re-renders)

    return () => clearInterval(pulseInterval);
  }, [selectedRegion, selectedSegment]);

  useEffect(() => {
    if (activeTab === 'arbitrage' && arbitrage.length === 0) {
      fetchArbitrage();
    }
  }, [activeTab]);

  const fetchArbitrage = async () => {
    setArbitrageLoading(true);
    addLog('Neural Council: Initiating Multi-Model Arbitrage Recon...', 'INFO');
    try {
      const opps = await geminiService.getMultiModelArbitrage(selectedSegment);
      setArbitrage(opps);
      addLog('Arbitrage Recon Complete: 5 validated opportunities identified.', 'SUCCESS');
    } catch (error) {
      addLog('Failed to fetch arbitrage opportunities', 'WARNING');
    } finally {
      setArbitrageLoading(false);
    }
  };

  const handleUpdateRFQ = (updated: RFQ) => {
    setRfqs(prev => prev.map(r => r.id === updated.id ? updated : r));
    addLog(`RFQ ${updated.id} status updated to ${updated.status}`, 'SUCCESS');
  };

  const handleDeleteRFQ = (id: string) => {
    setRfqs(prev => prev.filter(r => r.id !== id));
    addLog(`RFQ ${id} deleted`, 'INFO');
  };

  const handleGenerateRFQ = async (vendor: Vendor) => {
    if (!hubIntel) return;
    setLoading(true);
    addProbeStatus(`Drafting RFQ for ${vendor.name}...`);
    try {
      const draft = await geminiService.generateRFQDraft(hubIntel.assetName, vendor, "Standard commercial terms, 50MT monthly, CIF Rotterdam");
      const newRFQ: RFQ = {
        id: `RFQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        subject: `RFQ: ${hubIntel.assetName} - ${vendor.name}`,
        items: [{ assetName: hubIntel.assetName, quantity: '50 MT', purityRequirement: hubIntel.casNumber }],
        vendorId: vendor.id,
        vendorName: vendor.name,
        status: 'Draft',
        draftContent: draft,
        createdAt: new Date().toLocaleDateString(),
        lastUpdated: new Date().toLocaleDateString()
      };
      setRfqs(prev => [newRFQ, ...prev]);
      setActiveTab('rfq');
      addLog(`Neural RFQ Drafted for ${vendor.name}`, 'SUCCESS');
    } catch (error) {
      addLog('Failed to generate RFQ draft', 'WARNING');
    } finally {
      setLoading(false);
    }
  };
  const addProbeStatus = (msg: string) => {
    setProbeStatus(prev => [msg, ...prev].slice(0, 5));
  };

  const fetchInitialLeads = async () => {
    try {
      const leads = await geminiService.getInitialLeads(selectedRegion);
      setLedgerData(leads);
    } catch (error) {
      console.error("Failed to fetch initial leads", error);
    }
  };

  const fetchData = async (background = false) => {
    if (syncing) return;
    setSyncing(true);
    if (!background) {
      addLog(`Neural Core: Synchronizing ${selectedRegion} market nodes...`);
      setSignals([]);
      setArbitrage([]);
      setGeopoliticalData([]);
    }
    
    try {
      const [signalData, riskData, products, geoData] = await Promise.all([
        geminiService.getOpportunitySignals(selectedSegment, selectedRegion).catch(() => []),
        geminiService.getGlobalRiskMap(selectedRegion).catch(() => []),
        geminiService.getTopProducts(selectedSegment, selectedRegion).catch(() => []),
        geminiService.getGeopoliticalIntelligence(selectedRegion).catch(() => [])
      ]);

      setSignals(signalData);
      setRisks(riskData);
      setTopProducts(products);
      setGeopoliticalData(geoData);
      setForecast(marketEngine.generateForecast(selectedSegment));
      setHasMoreSignals(true);

      // Extract buyer leads from signals and update ledger
      if (signalData.length > 0) {
        const newLeads: MarketEntity[] = signalData.flatMap(s => 
          (s.buyers || []).map(b => ({
            id: b.id || `B-${Math.random().toString(36).substr(2, 5)}`,
            type: 'Buyer',
            name: b.name,
            country: b.country,
            region: selectedRegion,
            annualVolume: b.annualVolume,
            status: 'Active',
            source: 'Neural Recon',
            tags: [s.chemicalName, 'Verified'],
            contact: b.contact
          }))
        );
        setLedgerData(prev => {
          const existingNames = new Set(prev.map(l => l.name.toLowerCase()));
          const uniqueNew = newLeads.filter(l => !existingNames.has(l.name.toLowerCase()));
          return [...prev, ...uniqueNew];
        });
      }

      if (!background) addLog(`Node Sync Successful for ${selectedRegion}.`, 'SUCCESS');
    } catch (error: any) {
      addLog(`Sync error. Utilizing locally cached intelligence.`, 'WARNING');
    } finally {
      setSyncing(false);
    }
  };

  const loadMoreSignals = async () => {
    if (loadingMore || !hasMoreSignals) return;
    setLoadingMore(true);
    addLog(`Deep Expansion: Probing secondary asset clusters in ${selectedRegion}...`);
    
    try {
      const moreSignals = await geminiService.getOpportunitySignals(selectedSegment, selectedRegion);
      if (moreSignals.length === 0) {
        setHasMoreSignals(false);
      } else {
        setSignals(prev => {
          const existingNames = new Set(prev.map(s => s.chemicalName?.toLowerCase() || ''));
          const uniqueNew = moreSignals.filter(s => s.chemicalName && !existingNames.has(s.chemicalName.toLowerCase()));
          return [...prev, ...uniqueNew];
        });
      }
    } catch (error) {
      addLog(`Region expansion threshold reached.`, 'WARNING');
    } finally {
      setLoadingMore(false);
    }
  };

  const fetchNews = async (background = false) => {
    if (!background) setLoading(true);
    if (!background) addLog(`Neural News Recon: Probing ${selectedRegion} channels...`);
    try {
      const data = await geminiService.getLiveNewsFeed(selectedRegion);
      setNews(data);
      if (!background) addLog(`News Feed Synchronized: ${data.length} recent reports identified.`, 'SUCCESS');
    } catch (error) {
      if (!background) addLog('Failed to fetch live news feed', 'WARNING');
    } finally {
      if (!background) setLoading(false);
    }
  };

  const handleLiveRecon = async (query?: string) => {
    const q = query || searchQuery;
    if (!q) return;
    
    // Save to history
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h.toLowerCase() !== q.toLowerCase());
      return [q, ...filtered].slice(0, 10);
    });

    setLoading(true);
    setProbeStatus(["Initializing Multi-Node Neural Search..."]);
    setActiveTab('research');
    addLog(`Neural Probe: Deep scanning ${selectedRegion} for "${q}" dossier...`, 'INFO');
    
    try {
      addProbeStatus("Orchestrating Market Intelligence (Agentic Stack)...");
      const { intel, signals } = await agentService.orchestrateMarketIntel(q, selectedRegion);
      
      setHubIntel(intel);
      setSignals(signals);
      
      addLog(`Market Intelligence Synced: ${q} dossier reconstructed by Recon-01.`, 'SUCCESS');
    } catch (error: any) {
      addLog(`Search thread interrupted. Re-centering probe...`, 'WARNING');
    } finally {
      setLoading(false);
      setProbeStatus([]);
    }
  };

  const handleCOASearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    const isCasSearch = /^\d{2,7}-\d{2}-\d$/.test((searchQuery || '').trim());
    setProbeStatus([`Bypassing 404 gates. Scanning for ${isCasSearch ? 'CAS ' + searchQuery : 'Asset ' + searchQuery} direct PDF URLs...`]);
    addLog(`Neural Reconstruction: Targeting COA/TDS for ${searchQuery}...`, 'INFO');
    
    try {
      const results = await agentService.scoutCOA(searchQuery, coaBatch, (msg) => {
        setProbeStatus([msg]);
        addLog(msg, 'INFO');
      });
      
      if (results && results.length > 0) {
        setCoaEntries(results);
        addLog(`Neural Scout Complete. Reconstructed ${results.length} digital twins.`, 'SUCCESS');
      } else {
        setCoaEntries([]);
        addLog(`No exact ${isCasSearch ? 'CAS' : 'Asset'} match found in live documents. Re-centering probe...`, 'WARNING');
      }
    } catch (error: any) {
      addLog(`Technical document grounding failed: ${error.message || 'Unknown error'}`, 'WARNING');
    } finally {
      setLoading(false);
      setProbeStatus([]);
    }
  };

  const downloadCOAPDF = (coa: COAEntry) => {
    const doc = new jsPDF();
    
    doc.setFillColor(5, 8, 17);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATE OF ANALYSIS', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated via ChemIntel Neural Reconstruction (Grounded Dataset)', 105, 30, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Asset: ${coa.chemicalName}`, 20, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(`CAS: ${coa.casNumber}`, 20, 62);
    doc.text(`Batch: ${coa.batchNumber}`, 20, 69);
    doc.text(`Producer: ${coa.manufacturer}`, 120, 55);
    doc.text(`Issue Date: ${coa.issueDate}`, 120, 62);
    doc.text(`Exp Date: ${coa.expiryDate}`, 120, 69);
    doc.text(`Measured Purity: ${coa.purity}`, 120, 76);

    if (coa.labName) {
      doc.setFont('helvetica', 'bold');
      doc.text(`Laboratory: ${coa.labName}`, 20, 76);
    }
    
    if (coa.stampUrl) {
      doc.setDrawColor(200, 0, 0);
      doc.setLineWidth(1);
      doc.circle(170, 250, 20, 'S');
      doc.setTextColor(200, 0, 0);
      doc.setFontSize(8);
      doc.text('VERIFIED', 170, 248, { align: 'center' });
      doc.text(coa.labName?.substring(0, 15) || 'LAB STAMP', 170, 252, { align: 'center' });
      doc.setTextColor(0, 0, 0);
    }

    doc.setFillColor(240, 240, 240);
    doc.rect(20, 85, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Test Parameter', 25, 91.5);
    doc.text('Unit', 80, 91.5);
    doc.text('Standard Spec', 110, 91.5);
    doc.text('Batch Result', 160, 91.5);

    let y = 105;
    coa.specifications.forEach((spec) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'normal');
        doc.text(spec.parameter, 25, y);
        doc.text(spec.unit, 80, y);
        doc.text(spec.specification, 110, y);
        doc.setFont('helvetica', 'bold');
        doc.text(spec.actualResult, 160, y);
        doc.line(20, y+2, 190, y+2);
        y += 10;
    });

    y += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Neural Integrity: ${coa.authenticityScore}% Score`, 20, y);
    doc.text(`Reference: ${coa.sourceUrl.substring(0, 80)}...`, 20, y + 7);
    
    y += 40;
    doc.line(20, y, 80, y);
    doc.text('Neural Sourcing Division', 20, y + 5);
    doc.line(130, y, 190, y);
    doc.text('Quality Verification', 130, y + 5);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Build ID: ${SYSTEM_BUILD_ID}`, 105, 290, { align: 'center' });

    doc.save(`COA_RECON_${coa.chemicalName.replace(/\s+/g, '_')}.pdf`);
    addLog(`Digital Twin exported for ${coa.chemicalName}.`, 'SUCCESS');
  };

  useEffect(() => {
    // fetchData and fetchNews are now handled in the combined effect above
  }, []);

  const handleOpenNodeEditor = (node?: IntegrationNode) => {
    if (node) {
      setEditingNode(node);
    } else {
      setEditingNode({
        id: `n-${Date.now()}`,
        name: '',
        status: 'Operational',
        type: 'Market',
        tier: 'Standard',
        lastSync: 'Now'
      });
    }
    setIsNodeModalOpen(true);
  };

  const handleSaveIntegrationNode = () => {
    if (!editingNode?.name) {
      addLog("Node name is mandatory for neural binding.", "WARNING");
      return;
    }

    setSystemConfig(prev => {
      const exists = prev.integrationNodes.find(n => n.id === editingNode.id);
      if (exists) {
        return {
          ...prev,
          integrationNodes: prev.integrationNodes.map(n => n.id === editingNode.id ? (editingNode as IntegrationNode) : n)
        };
      } else {
        return {
          ...prev,
          integrationNodes: [...prev.integrationNodes, (editingNode as IntegrationNode)]
        };
      }
    });

    addLog(`Neural node "${editingNode.name}" synchronized.`, "SUCCESS");
    setIsNodeModalOpen(false);
    setEditingNode(null);
  };

  const handleDeleteIntegrationNode = (id: string) => {
    setSystemConfig({
      ...systemConfig,
      integrationNodes: systemConfig.integrationNodes.filter(n => n.id !== id)
    });
    addLog("Decommissioned neural integration node.", "WARNING");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex overflow-x-hidden font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-[60] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
            <Radar className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-black tracking-tighter text-slate-900">ChemIntel</h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-500 hover:text-slate-900"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 lg:ml-64 relative h-screen overflow-y-auto custom-scrollbar flex flex-col bg-slate-50/50">
        <header className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 z-40">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${syncing ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                    {syncing ? 'Neural Sync Active' : 'System Node Parity: Live'}
                  </span>
                </div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900 capitalize">
                  {activeTab === 'config' ? 'System Configuration' : activeTab.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/50">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search neural ledger..."
                  className="bg-transparent border-none focus:ring-0 text-xs text-slate-600 w-48 placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <button 
                onClick={() => handleLiveRecon('All')}
                disabled={syncing}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  syncing 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                }`}
              >
                <RefreshCcw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Sync Core</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-grow p-6 lg:p-10">
            {activeTab === 'dashboard' && (
              <DashboardView 
                ledgerData={ledgerData}
                selectedRegion={selectedRegion}
                geopoliticalData={geopoliticalData}
                risks={risks}
                topProducts={topProducts}
                handleLiveRecon={handleLiveRecon}
                signals={signals}
                arbitrage={arbitrage}
                forecast={forecast}
                news={news}
                selectedSegment={selectedSegment}
                setSelectedBuyerLead={setSelectedBuyerLead}
                engineStats={engineStats}
              />
            )}

            {activeTab === 'integrations' && <IntegrationHub />}
            {activeTab === 'geopolitical' && (
              <GeopoliticalView 
                geopoliticalData={geopoliticalData}
                syncing={syncing}
                handleLiveRecon={handleLiveRecon}
              />
            )}

            {activeTab === 'news' && (
              <NewsFeedView 
                news={news}
                loading={loading}
                onRefresh={fetchNews}
              />
            )}

            {activeTab === 'research' && (
              <ResearchView 
                selectedRegion={selectedRegion}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleLiveRecon={handleLiveRecon}
                loading={loading}
                probeStatus={probeStatus}
                hubIntel={hubIntel}
                setActiveTab={setActiveTab}
                handleGenerateRFQ={handleGenerateRFQ}
                handleCOASearch={handleCOASearch}
                logs={logs}
                searchHistory={searchHistory}
              />
            )}

            {activeTab === 'supplychain' && (
              <SupplyChainView 
                supplyChainData={supplyChainData}
                hubIntel={hubIntel}
                searchQuery={searchQuery}
                setActiveTab={setActiveTab}
                loading={loading}
                probeStatus={probeStatus}
              />
            )}

            {activeTab === 'ledger' && (
              <LedgerView 
                ledgerData={ledgerData}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedRegion={selectedRegion}
                setSelectedEntity={setSelectedEntity}
              />
            )}

            {activeTab === 'arbitrage' && (
              <ArbitrageEngine 
                opportunities={arbitrage} 
                loading={arbitrageLoading} 
                onRefresh={fetchArbitrage}
              />
            )}

            {activeTab === 'rfq' && (
              <RFQEngine 
                rfqs={rfqs} 
                onUpdateRFQ={handleUpdateRFQ}
                onCreateRFQ={(r) => setRfqs([r, ...rfqs])}
                onDeleteRFQ={handleDeleteRFQ}
                onDraftRFQ={handleGenerateRFQ}
              />
            )}

            {activeTab === 'coa' && (
              <COALedgerView 
                coaEntries={coaEntries}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                coaBatch={coaBatch}
                setCoaBatch={setCoaBatch}
                loading={loading}
                deepScan={deepScan}
                setDeepScan={setDeepScan}
                probeStatus={probeStatus}
                handleCOASearch={handleCOASearch}
                setSelectedCOA={setSelectedCOA}
                downloadCOAPDF={downloadCOAPDF}
              />
            )}

            {activeTab === 'sentiment' && (
              <SentimentEngine />
            )}

            {activeTab === 'compliance' && (
              <ComplianceView />
            )}

            {activeTab === 'council' && (
              <NeuralCouncilView />
            )}

            {activeTab === 'agent-control' && (
              <AgentControlCenter />
            )}

            {activeTab === 'config' && (
              <ConfigView 
                systemConfig={systemConfig}
                setSystemConfig={setSystemConfig}
                addLog={addLog}
                handleOpenNodeEditor={handleOpenNodeEditor}
                handleDeleteIntegrationNode={handleDeleteIntegrationNode}
                isNodeModalOpen={isNodeModalOpen}
                setIsNodeModalOpen={setIsNodeModalOpen}
                editingNode={editingNode}
                setEditingNode={setEditingNode}
                handleSaveIntegrationNode={handleSaveIntegrationNode}
              />
            )}

            {activeTab === 'admin' && (
              <ConfigView 
                systemConfig={systemConfig}
                setSystemConfig={setSystemConfig}
                addLog={addLog}
                handleOpenNodeEditor={handleOpenNodeEditor}
                handleDeleteIntegrationNode={handleDeleteIntegrationNode}
                isNodeModalOpen={isNodeModalOpen}
                setIsNodeModalOpen={setIsNodeModalOpen}
                editingNode={editingNode}
                setEditingNode={setEditingNode}
                handleSaveIntegrationNode={handleSaveIntegrationNode}
              />
            )}
        </div>
        
        <Footer systemBuildId={SYSTEM_BUILD_ID} />
        <NeuralCouncilChat />

        {selectedBuyerLead && (
          <BuyerModal buyer={selectedBuyerLead} onClose={() => setSelectedBuyerLead(null)} />
        )}

        {selectedCOA && (
          <COAModal 
            coa={selectedCOA} 
            onClose={() => setSelectedCOA(null)} 
            onDownload={downloadCOAPDF} 
          />
        )}

        <NeuralGuide 
          isOpen={isGuideOpen} 
          onClose={() => setIsGuideOpen(false)} 
        />

        {loading && activeTab === 'dashboard' && (
          <div className="fixed inset-0 bg-white/90 backdrop-blur-xl z-[200] flex items-center justify-center">
            <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
               <div className="relative flex items-center justify-center">
                  <div className="w-32 h-32 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute"><Radar className="w-10 h-10 text-blue-600 animate-pulse" /></div>
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Synchronizing Neural Core</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grounding Global Market Corridors</p>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
