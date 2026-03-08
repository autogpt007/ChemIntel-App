import React, { useState } from 'react';
import { 
  MarketEntity, GeopoliticalImpact, MarketRisk, ArbitrageOpportunity, 
  MarketSignal, ForecastData, BuyerLead 
} from '../types';
import { 
  Zap, TrendingUp, TrendingDown, Activity, Globe2, ArrowRight, Shield, Radar,
  ChevronDown, ChevronUp, Lightbulb, Mail, User, MapPin
} from 'lucide-react';
import MarketChart from './MarketChart';

interface DashboardViewProps {
  ledgerData: MarketEntity[];
  geopoliticalData: GeopoliticalImpact[];
  risks: MarketRisk[];
  topProducts: any[];
  signals: MarketSignal[];
  arbitrage: ArbitrageOpportunity[];
  forecast: ForecastData[];
  selectedRegion: string;
  selectedSegment: string;
  handleLiveRecon: (name: string) => void;
  setSelectedBuyerLead: (buyer: BuyerLead) => void;
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
  selectedRegion,
  selectedSegment,
  handleLiveRecon,
  setSelectedBuyerLead
}) => {
  const [expandedSignals, setExpandedSignals] = useState<string[]>([]);

  const toggleSignalExpansion = (id: string) => {
    setExpandedSignals(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-blue-600/10 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 flex items-center gap-2">
              <Globe2 className="w-3 h-3" /> Search Grounded Intelligence
            </div>
            <div className="px-3 py-1 bg-emerald-600/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
              <Zap className="w-3 h-3" /> Live Neural Recon
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl">
            <h4 className="text-slate-500 text-[10px] font-black uppercase mb-2">Verified Connections</h4>
            <p className="text-4xl font-black text-white">{ledgerData.filter(l => selectedRegion === 'Global' || l.region === selectedRegion).length}</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl">
            <h4 className="text-slate-500 text-[10px] font-black uppercase mb-2">Geopolitical Signals</h4>
            <p className="text-4xl font-black text-orange-500">{geopoliticalData.length}</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl">
            <h4 className="text-slate-500 text-[10px] font-black uppercase mb-2">Threat Vectors</h4>
            <p className="text-4xl font-black text-red-500">{risks.length}</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl">
            <h4 className="text-slate-500 text-[10px] font-black uppercase mb-2">Compliance Pulse</h4>
            <p className="text-4xl font-black text-emerald-500">92%</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl">
            <h4 className="text-slate-500 text-[10px] font-black uppercase mb-2">Market Sentiment</h4>
            <p className="text-4xl font-black text-blue-500">Bullish</p>
          </div>
        </div>

       <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
             <div className="bg-[#0c1220] border border-slate-800 rounded-[3rem] p-10 shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-3">
                    <Zap className="w-5 h-5 text-blue-500" /> Sector Movers
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="pb-4 text-[10px] font-black text-slate-500 uppercase">Chemical Asset</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 uppercase">Category</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 uppercase text-right">Trend</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 uppercase text-right">Avg Spot</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {topProducts?.map((p, i) => (
                        <tr key={i} className="group cursor-pointer hover:bg-slate-800/30 transition-all" onClick={() => handleLiveRecon(p.name)}>
                          <td className="py-4 font-black text-white group-hover:text-blue-400">{p.name}</td>
                          <td className="py-4 text-xs font-bold text-slate-500 uppercase">{p.sector}</td>
                          <td className={`py-4 text-right font-black ${(p.trend?.startsWith('+') ?? false) ? 'text-emerald-500' : 'text-red-500'}`}>{p.trend}</td>
                          <td className="py-4 text-right font-mono font-bold text-white">{p.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-8">
                {signals?.map((s, i) => (
                  <div key={i} className="bg-[#0c1220] border border-slate-800 rounded-[3rem] p-10 flex flex-col relative overflow-hidden group hover:border-blue-500/50 transition-all shadow-2xl">
                      <div className="flex justify-between items-start mb-10 z-10">
                         <div className="flex-1">
                           <div className="flex items-center gap-2 mb-3">
                             <span className="px-2.5 py-1 bg-blue-600/10 text-blue-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-500/20">Alpha Node</span>
                             <span className="px-2.5 py-1 bg-indigo-600/10 text-indigo-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">{s.segment}</span>
                           </div>
                           <h4 className="text-4xl font-black text-white group-hover:text-blue-400 tracking-tighter leading-none mb-6 truncate">{s.chemicalName}</h4>
                           <div className="flex items-center gap-6">
                             <div className="flex items-center gap-2 text-emerald-500">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-[11px] font-black uppercase">{s.growthRate} G-Rate</span>
                             </div>
                             <div className="flex items-center gap-2 text-slate-400">
                                <Activity className="w-4 h-4" />
                                <span className="text-[11px] font-black uppercase">{s.globalInventory} Supply</span>
                             </div>
                           </div>
                         </div>
                         <div className={`p-5 rounded-3xl border ${s.demandTrend === 'Up' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                           {s.demandTrend === 'Up' ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                         </div>
                      </div>

                      <div className="bg-blue-600/5 border border-blue-500/10 p-6 rounded-[2rem] mb-8 flex gap-4 items-start">
                        <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                        <p className="text-xs font-bold text-slate-300 leading-relaxed">{s.reasoning}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 z-10">
                         <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-slate-800">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Current Est.</p>
                            <p className="text-2xl font-black text-white">{s.priceEstimate || 'Pending...'}</p>
                         </div>
                         <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-slate-800">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Volatility</p>
                            <p className="text-2xl font-black text-blue-400">{s.volatilityScore}/100</p>
                         </div>
                         <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-slate-800">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Opp. Score</p>
                            <p className="text-2xl font-black text-emerald-400">{s.opportunityScore}/100</p>
                         </div>
                      </div>

                      {s.buyers && s.buyers.length > 0 && (
                        <div className="mb-8 z-10">
                          <button 
                            onClick={() => toggleSignalExpansion(s.id)}
                            className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-400 transition-colors"
                          >
                            {expandedSignals.includes(s.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {s.buyers.length} Verified Buyer Leads Identified
                          </button>
                          
                          {expandedSignals.includes(s.id) && (
                            <div className="mt-6 space-y-3 animate-in slide-in-from-top-4 duration-300">
                              {s.buyers.map((buyer, bi) => (
                                <div 
                                  key={bi} 
                                  onClick={() => setSelectedBuyerLead(buyer)}
                                  className="bg-slate-950/50 border border-slate-800 p-6 rounded-[1.5rem] flex items-center justify-between group/buyer cursor-pointer hover:border-blue-500/30 transition-all"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
                                      <User className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-black text-white group-hover/buyer:text-blue-400 transition-colors">{buyer.name}</p>
                                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {buyer.country} • {buyer.annualVolume}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                    <MiniTrendBar data={buyer.purchasingTrends || [40, 45, 42, 50, 55, 52, 60, 65, 62, 70, 75, 72]} />
                                    <ArrowRight className="w-4 h-4 text-slate-700 group-hover/buyer:text-blue-500 group-hover/buyer:translate-x-1 transition-all" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <button onClick={() => handleLiveRecon(s.chemicalName)} className="w-full py-6 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] shadow-xl hover:bg-blue-500 transition-all z-10">
                        Target Asset Recon
                      </button>
                  </div>
                ))}
             </div>
          </div>
          <div className="col-span-12 lg:col-span-4 space-y-8">
             <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3.5rem] shadow-2xl">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-10 flex items-center gap-3"><Globe2 className="w-5 h-5 text-indigo-500" /> Neural Arbitrage</h3>
                {arbitrage?.length > 0 ? arbitrage.map((a, i) => (
                  <div key={i} className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl mb-4 group hover:border-blue-500/30 transition-all">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-base font-black text-white group-hover:text-blue-400 transition-colors">{a.asset}</span>
                       <span className="text-xs font-black text-green-500">+{a.margin}</span>
                     </div>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{a.buyRegion} <ArrowRight className="inline w-3 h-3 mx-1" /> {a.sellRegion}</p>
                     <div className="mt-4 flex justify-between items-center text-[9px] font-black text-slate-600 uppercase">
                        <span>Potential: {a.volumePotential}</span>
                        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Risk: {a.riskFactor}/100</span>
                     </div>
                  </div>
                )) : (
                  <div className="py-20 text-center space-y-4">
                    <Radar className="w-10 h-10 text-slate-800 animate-pulse mx-auto" />
                    <p className="text-[10px] font-black text-slate-700 uppercase">Probing Corridors...</p>
                  </div>
                )}
             </div>
             <MarketChart data={forecast} title={`${selectedSegment} Outlook`} />
          </div>
       </div>
    </div>
  );
};

export default DashboardView;
