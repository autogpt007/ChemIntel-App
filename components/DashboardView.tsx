import React, { useState } from 'react';
import { 
  MarketEntity, GeopoliticalImpact, MarketRisk, ArbitrageOpportunity, 
  MarketSignal, ForecastData, BuyerLead, NewsArticle
} from '../types';
import { 
  Zap, TrendingUp, TrendingDown, Activity, Globe2, ArrowRight, Shield, Radar,
  ChevronDown, ChevronUp, Lightbulb, Mail, User, MapPin, Calculator, BrainCircuit
} from 'lucide-react';
import MarketChart from './MarketChart';

interface DashboardViewProps {
  ledgerData: MarketEntity[];
  geopoliticalData: GeopoliticalImpact[];
  risks: MarketRisk[];
  topProducts: { name: string; sector: string; trend: string; price: string }[];
  signals: MarketSignal[];
  arbitrage: ArbitrageOpportunity[];
  forecast: ForecastData[];
  news: NewsArticle[];
  selectedRegion: string;
  selectedSegment: string;
  handleLiveRecon: (name: string) => void;
  setSelectedBuyerLead: (buyer: BuyerLead) => void;
  engineStats: { convergence: number; entropy: number; forecastSkill: number };
}

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

const DashboardView: React.FC<DashboardViewProps> = ({
  ledgerData,
  geopoliticalData,
  risks,
  topProducts,
  signals,
  arbitrage,
  forecast,
  news,
  selectedRegion,
  selectedSegment,
  handleLiveRecon,
  setSelectedBuyerLead,
  engineStats
}) => {
  const [expandedSignals, setExpandedSignals] = useState<string[]>([]);

  const toggleSignalExpansion = (id: string) => {
    setExpandedSignals(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const sentiment = signals.length > 0 
    ? (signals.filter(s => s.demandTrend === 'Up').length / signals.length > 0.5 ? 'Bullish' : 'Bearish')
    : 'Stable';

  const complianceScore = risks.length > 0 
    ? Math.max(60, 98 - (risks.length * 5)) 
    : 98;

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-700 pb-20">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-5xl font-light text-slate-900 tracking-tight mb-4">Market Intelligence</h2>
            <p className="text-slate-500 text-sm lg:text-base leading-relaxed">
              Synthesized global chemical trade data, geopolitical risk signals, and neural market forecasts. 
              Grounding every decision in verified node intelligence.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-blue-100 flex items-center gap-2">
              <Globe2 className="w-3.5 h-3.5" /> Search Grounded
            </div>
            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-emerald-100 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" /> Neural Sync
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stitch-card p-6 lg:p-8">
            <h4 className="text-label mb-3">Verified Connections</h4>
            <div className="flex items-baseline gap-2">
              <p className="text-value">{ledgerData.filter(l => selectedRegion === 'Global' || l.region === selectedRegion).length}</p>
              <span className="text-xs font-medium text-slate-400">Active Nodes</span>
            </div>
          </div>
          <div className="stitch-card p-6 lg:p-8">
            <h4 className="text-label mb-3">Geopolitical Signals</h4>
            <div className="flex items-baseline gap-2">
              <p className="text-value text-orange-600">{geopoliticalData.length}</p>
              <span className="text-xs font-medium text-slate-400">Risk Indicators</span>
            </div>
          </div>
          <div className="stitch-card p-6 lg:p-8">
            <h4 className="text-label mb-3">Threat Vectors</h4>
            <div className="flex items-baseline gap-2">
              <p className="text-value text-red-600">{risks.length}</p>
              <span className="text-xs font-medium text-slate-400">Critical Alerts</span>
            </div>
          </div>
          <div className="stitch-card p-6 lg:p-8">
            <h4 className="text-label mb-3">Compliance Score</h4>
            <div className="flex items-baseline gap-2">
              <p className="text-value text-emerald-600">{complianceScore}%</p>
              <span className="text-xs font-medium text-slate-400">System Health</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="stitch-card p-6 lg:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Market Outlook</h3>
                  <p className="text-xs text-slate-500 mt-1">Predictive forecast for {selectedSegment}</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sentiment</span>
                      <span className={`text-xs font-bold ${sentiment === 'Bullish' ? 'text-emerald-600' : 'text-red-600'}`}>{sentiment}</span>
                   </div>
                </div>
              </div>
              <MarketChart data={forecast} title={`${selectedSegment} Outlook`} />
            </div>

            <div className="stitch-card p-6 lg:p-10 bg-slate-900 text-white border-none">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold tracking-tight flex items-center gap-3">
                  <Radar className="w-5 h-5 text-blue-500" /> Neural Intelligence Feed
                </h3>
                <button 
                  onClick={() => handleLiveRecon('Market')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                  Refresh Nodes
                </button>
              </div>
              
              <div className="space-y-4">
                {signals.slice(0, 4).map((signal) => (
                  <div 
                    key={signal.id} 
                    className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 transition-all cursor-pointer group"
                    onClick={() => toggleSignalExpansion(signal.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${signal.demandTrend === 'Up' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        <h4 className="text-sm font-bold text-slate-900">{signal.chemicalName}</h4>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{signal.predictionHorizon}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{signal.reasoning}</p>
                    
                    {expandedSignals.includes(signal.id) && (
                      <div className="mt-4 pt-4 border-t border-slate-200/50 grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Confidence</p>
                          <p className="text-xs font-bold text-blue-600">{signal.mathematicalConfidence}%</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Segment</p>
                          <p className="text-xs font-bold text-slate-700">{signal.segment}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="stitch-card p-6 lg:p-8">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-blue-600" /> Top Movers
              </h3>
              <div className="space-y-4">
                {topProducts.map((product, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{product.name}</p>
                      <p className="text-[10px] font-medium text-slate-500 uppercase">{product.sector}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{product.price}</p>
                      <p className={`text-[10px] font-bold ${product.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                        {product.trend}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="stitch-card p-6 lg:p-8 bg-blue-600 text-white border-none shadow-lg shadow-blue-600/20">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-3">
                <BrainCircuit className="w-5 h-5" /> Neural Engine
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-blue-100 uppercase">Convergence</span>
                    <span className="text-xs font-bold">{engineStats.convergence}%</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[94.2%]"></div>
                  </div>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                  <p className="text-[10px] font-bold text-blue-100 uppercase mb-1">Forecast Skill</p>
                  <p className="text-xl font-light">{engineStats.forecastSkill}% Accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default DashboardView;
