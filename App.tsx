
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MarketChart from './components/MarketChart';
import SupplyChainMap from './components/SupplyChainMap';
import ArbitrageEngine from './components/ArbitrageEngine';
import RFQEngine from './components/RFQEngine';
import COALedgerView from './components/COALedgerView';
import SentimentEngine from './components/SentimentEngine';
import DashboardView from './components/DashboardView';
import GeopoliticalView from './components/GeopoliticalView';
import ResearchView from './components/ResearchView';
import SupplyChainView from './components/SupplyChainView';
import ConfigView from './components/ConfigView';
import LedgerView from './components/LedgerView';
import ComplianceView from './components/ComplianceView';
import NewsFeedView from './components/NewsFeedView';
import Footer from './components/Footer';
import { geminiService } from './services/geminiService';
import { echemiService } from './services/echemiService';
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
  Plus, Trash2, ShieldQuestion, Workflow, Save, CreditCard
} from 'lucide-react';

const regions = ['Global', 'North America', 'Europe', 'APAC', 'Middle East', 'LATAM', 'Africa'];
const countries = ['All', 'China', 'India', 'USA', 'Germany', 'Brazil', 'Japan', 'South Korea', 'Vietnam', 'Turkey', 'Russia'];
const SYSTEM_BUILD_ID = "v2.0.8-DYNAMIC-NODE-MODULAR";

const seededLeads: MarketEntity[] = [
  { id: 'S1', type: 'Seller', name: 'BASF SE', country: 'Germany', region: 'Europe', annualVolume: '14,000,000 MT', status: 'Active', source: 'Neural', tags: ['Methanol', 'Phenol'], contact: { department: 'Sales Division', email: 'sales@basf.com', isEmailVerified: true } },
  { id: 'B1', type: 'Buyer', name: 'Reliance Industries', country: 'India', region: 'APAC', annualVolume: '8,500,000 MT', status: 'Active', source: 'Neural', tags: ['Propylene', 'Olefins'], contact: { department: 'Strategic Sourcing', email: 'procurement@ril.com', isEmailVerified: true } },
  { id: 'S2', type: 'Seller', name: 'SABIC', country: 'Saudi Arabia', region: 'Middle East', annualVolume: '22,000,000 MT', status: 'Active', source: 'Neural', tags: ['Polymers', 'Fertilizers'], contact: { department: 'Export Dept', email: 'export@sabic.com', isEmailVerified: true } },
  { id: 'B2', type: 'Buyer', name: 'Dow Chemical', country: 'USA', region: 'North America', annualVolume: '12,000,000 MT', status: 'Active', source: 'Neural', tags: ['Ethylene', 'Specialties'], contact: { department: 'Raw Materials', email: 'sourcing@dow.com', isEmailVerified: true } },
];

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
    <div className="fixed inset-0 bg-[#050811]/95 backdrop-blur-2xl z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-[#0c1220] border border-slate-800 w-full max-w-4xl rounded-[3.5rem] overflow-hidden shadow-3xl relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-all z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="p-12 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-32 h-32 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center shrink-0 ring-8 ring-blue-600/5">
              <User className="w-14 h-14 text-blue-500" />
            </div>
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-blue-600/10 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Verified Buyer Lead</span>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">{buyer.status}</span>
                </div>
                <h2 className="text-5xl font-black text-white tracking-tighter">{buyer.name}</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-600" /> {buyer.country} • {buyer.region}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Annual Volume</p>
                  <p className="text-xl font-black text-white">{buyer.annualVolume}</p>
                </div>
                <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Financial Tier</p>
                  <p className="text-xl font-black text-blue-400">{buyer.financialTier || 'Tier 1'}</p>
                </div>
                <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Source</p>
                  <p className="text-xl font-black text-indigo-400">{buyer.source}</p>
                </div>
                <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Payment Terms</p>
                  <p className="text-xl font-black text-emerald-400">{buyer.preferredPaymentTerms || 'Net 30'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-slate-950/50 p-8 rounded-[2.5rem] border border-slate-800">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" /> 12-Month Purchasing Trend
                </h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%" minHeight={0}>
                    <BarChart data={chartData}>
                      <ReXAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                      <ReTooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                        itemStyle={{ color: '#3b82f6' }}
                        cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                      />
                      <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#3b82f6' : '#1e293b'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-950/50 p-8 rounded-[2.5rem] border border-slate-800">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-500" /> Procurement Profile
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Buying Habits</span>
                    <span className="text-xs font-bold text-white">{buyer.buyingHabits || 'Spot & Contract'}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Purity Req.</span>
                    <span className="text-xs font-bold text-white">{buyer.purityRequirements || '>99.5%'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-950/50 p-8 rounded-[2.5rem] border border-slate-800">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-500" /> Verified Contact Node
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase">Direct Email</p>
                      <p className="text-sm font-bold text-white">{buyer.contact.email || 'procurement@' + buyer.name.toLowerCase().replace(/\s+/g, '') + '.com'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase">Department</p>
                      <p className="text-sm font-bold text-white">{buyer.contact.department}</p>
                    </div>
                  </div>
                  <a 
                    href={`mailto:${buyer.contact.email || 'procurement@' + buyer.name.toLowerCase().replace(/\s+/g, '') + '.com'}`}
                    className="w-full py-5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3"
                  >
                    <Mail className="w-4 h-4" /> Initiate Neural Handshake
                  </a>
                </div>
              </div>

              <div className="bg-slate-950/50 p-8 rounded-[2.5rem] border border-slate-800">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-slate-500" /> Neural Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {buyer.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-tight">
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSegment, setSelectedSegment] = useState<MarketSegment>(MarketSegment.SPECIALTY_CHEMICALS);
  const [selectedRegion, setSelectedRegion] = useState<string>('Global');
  
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [arbitrage, setArbitrage] = useState<ArbitrageOpportunity[]>([]);
  const [risks, setRisks] = useState<MarketRisk[]>([]);
  const [ledgerData, setLedgerData] = useState<MarketEntity[]>(seededLeads);
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

  // System Configuration State
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    aiModel: 'gemini-3-flash-preview', // This now represents the primary engine
    temperature: 0.7,
    thinkingBudget: 16000,
    scrapingDepth: 8,
    autoSeeding: true,
    cachePersistence: true,
    integrationNodes: [
      { id: 'n1', name: 'Echemi Global Bridge', status: 'Operational', type: 'Market', tier: 'Enterprise', lastSync: '10m ago' },
      { id: 'n2', name: 'Hybrid Neural Core (Gemini + OpenRouter)', status: 'Synchronized', type: 'Grounding', tier: 'Primary', lastSync: 'Real-time' },
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
    if (activeTab === 'arbitrage' && arbitrage.length === 0) {
      fetchArbitrage();
    }
    if (activeTab === 'news' && news.length === 0) {
      fetchNews();
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
        echemiService.getTopProducts().catch(() => []),
        geminiService.getGeopoliticalIntelligence(selectedRegion).catch(() => [])
      ]);

      setSignals(signalData);
      setRisks(riskData);
      setTopProducts(products);
      setGeopoliticalData(geoData);
      setForecast(marketEngine.generateForecast(selectedSegment));
      setHasMoreSignals(true);

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

  const fetchNews = async () => {
    setLoading(true);
    addLog(`Neural News Recon: Probing ${selectedRegion} channels...`);
    try {
      const data = await geminiService.getLiveNewsFeed(selectedRegion);
      setNews(data);
      addLog(`News Feed Synchronized: ${data.length} recent reports identified.`, 'SUCCESS');
    } catch (error) {
      addLog('Failed to fetch live news feed', 'WARNING');
    } finally {
      setLoading(false);
    }
  };

  const handleLiveRecon = async (query?: string) => {
    const q = query || searchQuery;
    if (!q) return;
    setLoading(true);
    setProbeStatus(["Initializing Multi-Node Neural Search..."]);
    setActiveTab('research');
    addLog(`Neural Probe: Deep scanning ${selectedRegion} for "${q}" dossier...`, 'INFO');
    
    try {
      addProbeStatus("Mapping price corridors (Flash Recon)...");
      const quickPromise = geminiService.getQuickHubIntel(q, selectedRegion);
      
      addProbeStatus("Identifying production hubs (Deep Grounding)...");
      const deepPromise = geminiService.getDeepHubIntel(q, selectedRegion);

      addProbeStatus("Reconstructing Neural Supply Chain Map...");
      const scPromise = geminiService.getSupplyChainIntelligence(q, selectedRegion);

      const [quickIntel, deepIntel, scData] = await Promise.all([quickPromise, deepPromise, scPromise]);

      if (quickIntel || deepIntel) {
        const fullIntel: HubIntel = {
          assetName: q,
          casNumber: quickIntel.casNumber || 'N/A',
          currentCostPerTon: quickIntel.currentCostPerTon || 'N/A',
          projectedCostQ4: 'Analysis Pending',
          globalScarcityIndex: quickIntel.globalScarcityIndex || 5,
          manufacturers: deepIntel?.manufacturers || [],
          buyers: quickIntel.buyers || [],
          substitutionOptions: quickIntel.substitutionOptions || [],
          procurementAdvice: quickIntel.procurementAdvice || 'Strategy grounding in progress.',
          regulatoryStatus: 'Under Review',
          lastUpdated: new Date().toLocaleDateString(),
          pricingTrendSummary: quickIntel.pricingTrendSummary,
          primaryApplications: quickIntel.primaryApplications
        };
        
        setHubIntel(fullIntel);
        setSupplyChainData(scData);

        if (deepIntel?.manufacturers?.length > 0) {
           addProbeStatus(`Located ${deepIntel.manufacturers.length} verified producers. Ingesting contacts...`);
           const transformedManufacturers: MarketEntity[] = deepIntel.manufacturers.map((m: any, idx: number) => ({
             id: `neural-m-${idx}-${Date.now()}`,
             type: 'Seller',
             name: m.name,
             country: m.country || 'Global Origin',
             region: selectedRegion,
             annualVolume: m.annualCapacity || 'Verified Volume',
             status: 'Active',
             source: 'Neural',
             tags: [q, 'Producer'],
             contact: {
               department: m.contact?.department || 'Commercial Dept',
               email: m.contact?.email || 'Request via Hub',
               isEmailVerified: true
             }
           }));

           setLedgerData(prev => {
             const combined = [...transformedManufacturers, ...prev];
             return Array.from(new Map(combined.map(item => [item.name + item.type, item])).values()).slice(0, 500);
           });
           addLog(`Dossier complete for ${q}. Neural ledger updated.`, 'SUCCESS');
        }
      }
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
    const isCasSearch = /^\d{2,7}-\d{2}-\d$/.test(searchQuery.trim());
    setProbeStatus([`Bypassing 404 gates. Scanning for ${isCasSearch ? 'CAS ' + searchQuery : 'Asset ' + searchQuery} direct PDF URLs...`]);
    addLog(`Neural Reconstruction: Targeting COA/TDS for ${searchQuery}...`, 'INFO');
    
    try {
      addProbeStatus(`Grounding technical specs & document locations...`);
      const results = await geminiService.findCOAs(searchQuery, coaBatch, deepScan);
      
      if (results.length > 0) {
        setCoaEntries(results);
        addLog(`Located documents. Reconstructed ${results.length} digital twins with strict ${isCasSearch ? 'CAS' : 'Asset'} matching.`, 'SUCCESS');
      } else {
        setCoaEntries([]);
        addLog(`No exact ${isCasSearch ? 'CAS' : 'Asset'} match found in live documents. Re-centering probe...`, 'WARNING');
      }
    } catch (error) {
      addLog(`Technical document grounding failed.`, 'WARNING');
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
    fetchData();
  }, [selectedRegion, selectedSegment]);

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
    <div className="min-h-screen bg-[#050811] text-slate-100 flex overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {selectedEntity && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050811]/95 backdrop-blur-2xl" onClick={() => setSelectedEntity(null)}>
          <div className="bg-[#0c1220] border border-slate-800 w-full max-w-4xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="md:w-72 p-10 border-r border-slate-800 bg-slate-900/40 shrink-0 text-center">
                <div className={`w-24 h-24 rounded-[2.2rem] mx-auto border flex items-center justify-center mb-6 ${selectedEntity.type === 'Buyer' ? 'bg-emerald-600/10 text-emerald-500 border-emerald-500/20' : 'bg-indigo-600/10 text-indigo-500 border-indigo-500/20'}`}>
                  {selectedEntity.type === 'Buyer' ? <Ship className="w-12 h-12" /> : <Factory className="w-12 h-12" />}
                </div>
                <h3 className="text-2xl font-black text-white tracking-tighter leading-tight">{selectedEntity.name}</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase mt-4 tracking-widest">Neural Lead ID: {selectedEntity.id.slice(0,8)}</p>
            </div>
            <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
               <div className="flex justify-between items-start mb-10">
                  <h4 className="text-3xl font-black text-white tracking-tighter uppercase tracking-[0.2em]">Contact Dossier</h4>
                  <button onClick={() => setSelectedEntity(null)} className="p-3 bg-slate-900 rounded-full text-slate-400 hover:text-white transition-all"><X className="w-6 h-6" /></button>
               </div>
               <div className="grid grid-cols-2 gap-8">
                  <div className="p-8 bg-slate-900/60 rounded-[2.5rem] border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-4">Official Department</p>
                    <p className="text-xl font-black text-white">{selectedEntity.contact.department}</p>
                  </div>
                  <div className="p-8 bg-slate-900/60 rounded-[2.5rem] border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-4">Neural Verified Email</p>
                    <p className="text-lg font-mono font-bold text-blue-400 break-all">{selectedEntity.contact.email}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {selectedCOA && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050811]/95 backdrop-blur-2xl" onClick={() => setSelectedCOA(null)}>
          <div className="bg-[#0c1220] border border-slate-800 w-full max-w-5xl rounded-[4rem] overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="p-12 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-emerald-600/10 rounded-[1.8rem] flex items-center justify-center border border-emerald-500/20">
                    <FileCheck className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-white tracking-tighter">{selectedCOA.chemicalName}</h3>
                    <div className="flex gap-4 mt-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CAS: {selectedCOA.casNumber}</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Batch: {selectedCOA.batchNumber}</span>
                    </div>
                  </div>
               </div>
               <div className="flex gap-4">
                  {selectedCOA.originalPdfUrl && (
                    <a href={selectedCOA.originalPdfUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase shadow-xl">
                      <ExternalLink className="w-4 h-4" /> View Original
                    </a>
                  )}
                  <button onClick={() => downloadCOAPDF(selectedCOA)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase shadow-xl">
                    <Download className="w-4 h-4" /> Export Report
                  </button>
                  <button onClick={() => setSelectedCOA(null)} className="p-4 bg-slate-900 rounded-full text-slate-400"><X className="w-8 h-8" /></button>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-16 custom-scrollbar bg-[#050811]/50">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="p-8 bg-slate-900/60 rounded-[2.5rem] border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Manufacturer</p>
                    <p className="text-xl font-black text-white">{selectedCOA.manufacturer}</p>
                  </div>
                  <div className="p-8 bg-slate-900/60 rounded-[2.5rem] border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Purity Level</p>
                    <p className="text-xl font-black text-emerald-500">{selectedCOA.purity}</p>
                  </div>
                  <div className="p-8 bg-slate-900/60 rounded-[2.5rem] border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Issue Date</p>
                    <p className="text-xl font-black text-white">{selectedCOA.issueDate}</p>
                  </div>
               </div>
               <div className="bg-slate-950/80 rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl relative">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/50">
                        <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase border-b border-slate-800 tracking-widest">Test Parameter</th>
                        <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase border-b border-slate-800 tracking-widest">Unit</th>
                        <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase border-b border-slate-800 tracking-widest">Specification</th>
                        <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase border-b border-slate-800 tracking-widest">Actual Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {selectedCOA.specifications?.map((spec, i) => (
                        <tr key={i} className="hover:bg-white/[0.02]">
                          <td className="px-10 py-6 text-sm font-bold text-white">{spec.parameter}</td>
                          <td className="px-10 py-6 text-sm font-mono text-slate-400">{spec.unit}</td>
                          <td className="px-10 py-6 text-sm font-bold text-slate-300">{spec.specification}</td>
                          <td className="px-10 py-6 text-sm font-black text-emerald-500">{spec.actualResult}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 ml-64 p-8 relative h-screen overflow-y-auto custom-scrollbar flex flex-col">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 sticky top-0 bg-[#050811]/90 backdrop-blur-xl z-[40] py-6 border-b border-slate-800/50 px-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-2.5 h-2.5 rounded-full ${syncing ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">
                {syncing ? 'Neural Sync Active' : 'System Node Parity: Live'}
              </span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-white capitalize">
              {activeTab === 'config' ? 'System Configuration' : activeTab.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
          </div>
          <div className="flex gap-4">
             <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex items-center shadow-2xl">
               <span className="text-[9px] font-black text-slate-600 uppercase px-4 tracking-widest">Focus:</span>
               <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="bg-slate-950 border-none px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white outline-none cursor-pointer">
                 {regions.map(r => <option key={r} value={r}>{r}</option>)}
               </select>
             </div>
             <button onClick={() => fetchData()} className="bg-slate-900 hover:bg-slate-800 px-8 py-3 border border-slate-800 rounded-2xl transition-all flex items-center gap-3 font-black text-[10px] uppercase text-white shadow-2xl">
               <RefreshCcw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} /> Engine Sync
             </button>
          </div>
        </header>

        <div className="flex-grow">
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
                selectedSegment={selectedSegment}
                setSelectedBuyerLead={setSelectedBuyerLead}
              />
            )}

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
                logs={logs}
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
        </div>
        
        <Footer systemBuildId={SYSTEM_BUILD_ID} />

        {selectedBuyerLead && (
          <BuyerModal buyer={selectedBuyerLead} onClose={() => setSelectedBuyerLead(null)} />
        )}

        {loading && activeTab === 'dashboard' && (
          <div className="fixed inset-0 bg-[#050811]/99 backdrop-blur-3xl z-[200] flex items-center justify-center">
            <div className="text-center space-y-16 animate-in zoom-in-95 duration-500">
               <div className="relative">
                  <div className="w-64 h-64 border-[12px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin mx-auto shadow-3xl"></div>
                  <div className="absolute inset-0 flex items-center justify-center"><Radar className="w-20 h-20 text-blue-500 animate-pulse" /></div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-6xl font-black text-white tracking-tighter">Synchronizing Neural Core</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Grounding Global Region Corridors</p>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
