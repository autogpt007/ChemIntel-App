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
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2">
              <Globe2 className="w-3 h-3" /> Search Grounded Intelligence
            </div>
            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
              <Zap className="w-3 h-3" /> Live Neural Recon
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          <div className="bg-white border border-slate-200 p-5 lg:p-8 rounded-2xl lg:rounded-[2rem] shadow-sm card-hover">
            <h4 className="text-slate-400 text-[9px] lg:text-[10px] font-black uppercase mb-2">Verified Connections</h4>
            <p className="text-xl lg:text-3xl font-black text-slate-900">{ledgerData.filter(l => selectedRegion === 'Global' || l.region === selectedRegion).length}</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 lg:p-8 rounded-2xl lg:rounded-[2rem] shadow-sm card-hover">
            <h4 className="text-slate-400 text-[9px] lg:text-[10px] font-black uppercase mb-2">Geopolitical Signals</h4>
            <p className="text-xl lg:text-3xl font-black text-orange-500">{geopoliticalData.length}</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 lg:p-8 rounded-2xl lg:rounded-[2rem] shadow-sm card-hover">
            <h4 className="text-slate-400 text-[9px] lg:text-[10px] font-black uppercase mb-2">Threat Vectors</h4>
            <p className="text-xl lg:text-3xl font-black text-red-500">{risks.length}</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 lg:p-8 rounded-2xl lg:rounded-[2rem] shadow-sm card-hover">
            <h4 className="text-slate-400 text-[9px] lg:text-[10px] font-black uppercase mb-2">Compliance Pulse</h4>
            <p className="text-xl lg:text-3xl font-black text-emerald-500">{complianceScore}%</p>
          </div>
          <div className="sm:col-span-2 lg:col-span-1 bg-white border border-slate-200 p-5 lg:p-8 rounded-2xl lg:rounded-[2rem] shadow-sm card-hover">
            <h4 className="text-slate-400 text-[9px] lg:text-[10px] font-black uppercase mb-2">Market Sentiment</h4>
            <p className={`text-xl lg:text-3xl font-black ${sentiment === 'Bullish' ? 'text-blue-600' : 'text-red-500'}`}>{sentiment}</p>
          </div>
        </div>

       <div className="grid grid-cols-12 gap-6 lg:gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-6 lg:space-y-8">
             <div className="bg-white border border-slate-200 rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-6 lg:mb-8">
                  <h3 className="text-base lg:text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                    <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" /> Sector Movers
                  </h3>
                  <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Real-time Node Feed</span>
                </div>
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-left min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-4 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase">Chemical Asset</th>
                        <th className="pb-4 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase">Category</th>
                        <th className="pb-4 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase text-right">Trend</th>
                        <th className="pb-4 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase text-right">Avg Spot</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {topProducts?.length > 0 ? topProducts.map((p, i) => (
                        <tr key={i} className="group cursor-pointer hover:bg-slate-50 transition-all" onClick={() => handleLiveRecon(p.name)}>
                          <td className="py-4 font-black text-slate-900 group-hover:text-blue-600 text-sm">{p.name}</td>
                          <td className="py-4 text-[10px] lg:text-xs font-bold text-slate-400 uppercase">{p.sector}</td>
                          <td className={`py-4 text-right font-black text-sm ${(p.trend?.startsWith('+') ?? false) ? 'text-emerald-600' : 'text-red-500'}`}>{p.trend}</td>
                          <td className="py-4 text-right font-mono font-bold text-slate-900 text-sm">{p.price}</td>
                        </tr>
                      )) : (
                        [1, 2, 3, 4, 5].map(i => (
                          <tr key={i} className="animate-pulse">
                            <td className="py-4"><div className="h-4 bg-slate-100 rounded w-3/4"></div></td>
                            <td className="py-4"><div className="h-4 bg-slate-100 rounded w-1/2"></div></td>
                            <td className="py-4"><div className="h-4 bg-slate-100 rounded w-1/4 ml-auto"></div></td>
                            <td className="py-4"><div className="h-4 bg-slate-100 rounded w-1/3 ml-auto"></div></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-6 lg:gap-8">
                {signals?.length > 0 ? signals.map((s, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 flex flex-col relative overflow-hidden group hover:border-blue-500/50 transition-all shadow-sm card-hover">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 lg:mb-10 z-10 gap-6">
                         <div className="flex-1 w-full">
                           <div className="flex flex-wrap items-center gap-2 mb-3">
                             <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">Alpha Node</span>
                             <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">{s.segment}</span>
                           </div>
                           <h4 className="text-2xl lg:text-4xl font-black text-slate-900 group-hover:text-blue-600 tracking-tighter leading-none mb-4 lg:mb-6 truncate">{s.chemicalName}</h4>
                           <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                             <div className="flex items-center gap-2 text-emerald-600">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-[10px] lg:text-[11px] font-black uppercase">{s.growthRate} G-Rate</span>
                             </div>
                             <div className="flex items-center gap-2 text-slate-400">
                                <Activity className="w-4 h-4" />
                                <span className="text-[10px] lg:text-[11px] font-black uppercase">{s.globalInventory} Supply</span>
                             </div>
                           </div>
                         </div>
                         <div className={`p-4 lg:p-5 rounded-2xl border self-start sm:self-auto ${s.demandTrend === 'Up' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-500'}`}>
                           {s.demandTrend === 'Up' ? <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8" /> : <TrendingDown className="w-6 h-6 lg:w-8 lg:h-8" />}
                         </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-100 p-5 lg:p-6 rounded-2xl mb-6 lg:mb-8 flex gap-4 items-start">
                        <Lightbulb className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 shrink-0 mt-1" />
                        <p className="text-[11px] lg:text-xs font-bold text-slate-600 leading-relaxed">{s.reasoning}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8 z-10">
                         <div className="bg-slate-50 p-4 lg:p-6 rounded-2xl border border-slate-100">
                            <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase mb-2">Current Est.</p>
                            <p className="text-lg lg:text-2xl font-black text-slate-900">{s.priceEstimate || 'Pending...'}</p>
                         </div>
                         <div className="bg-slate-50 p-4 lg:p-6 rounded-2xl border border-slate-100">
                            <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase mb-2">Volatility</p>
                            <p className="text-lg lg:text-2xl font-black text-blue-600">{s.volatilityScore}/100</p>
                         </div>
                         <div className="bg-slate-50 p-4 lg:p-6 rounded-2xl border border-slate-100">
                            <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase mb-2">Opp. Score</p>
                            <p className="text-lg lg:text-2xl font-black text-emerald-600">{s.opportunityScore}/100</p>
                         </div>
                         <div className="bg-slate-50 p-4 lg:p-6 rounded-2xl border border-slate-100">
                            <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase mb-2">Forecast Skill</p>
                            <p className="text-lg lg:text-2xl font-black text-indigo-600">{s.forecastSkill || 0}%</p>
                         </div>
                      </div>

                      <div className="flex flex-wrap gap-3 lg:gap-4 mb-6 lg:mb-8 z-10">
                        {s.peakSeason && (
                          <div className="px-3 py-1.5 lg:px-4 lg:py-2 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-2">
                            <TrendingUp className="w-3 h-3 text-orange-600" />
                            <span className="text-[9px] lg:text-[10px] font-black text-orange-600 uppercase">Peak Season: {s.peakSeason}</span>
                          </div>
                        )}
                        {s.mathematicalConfidence && (
                          <div className="px-3 py-1.5 lg:px-4 lg:py-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-2">
                            <Calculator className="w-3 h-3 text-indigo-600" />
                            <span className="text-[9px] lg:text-[10px] font-black text-indigo-600 uppercase">Math Confidence: {s.mathematicalConfidence}%</span>
                          </div>
                        )}
                      </div>

                      {s.buyers && s.buyers.length > 0 && (
                        <div className="mb-6 lg:mb-8 z-10">
                          <button 
                            onClick={() => toggleSignalExpansion(s.id)}
                            className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                          >
                            {expandedSignals.includes(s.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {s.buyers.length} Verified Buyer Leads Identified
                          </button>
                          
                          {expandedSignals.includes(s.id) && (
                            <div className="mt-4 lg:mt-6 space-y-3 animate-in slide-in-from-top-4 duration-300">
                              {s.buyers.map((buyer, bi) => (
                                <div 
                                  key={bi} 
                                  onClick={() => setSelectedBuyerLead(buyer)}
                                  className="bg-slate-50 border border-slate-100 p-4 lg:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between group/buyer cursor-pointer hover:border-blue-200 transition-all gap-4"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                      <User className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-black text-slate-900 group-hover/buyer:text-blue-600 transition-colors">{buyer.name}</p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {buyer.country} • {buyer.annualVolume}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                                    <MiniTrendBar data={buyer.purchasingTrends || [40, 45, 42, 50, 55, 52, 60, 65, 62, 70, 75, 72]} />
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover/buyer:text-blue-600 group-hover/buyer:translate-x-1 transition-all" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <button onClick={() => handleLiveRecon(s.chemicalName)} className="w-full py-4 lg:py-6 bg-blue-600 text-white text-[9px] lg:text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all z-10">
                        Target Asset Recon
                      </button>
                  </div>
                )) : (
                  [1, 2].map(i => (
                    <div key={i} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 animate-pulse">
                      <div className="h-8 bg-slate-100 rounded w-1/4 mb-4"></div>
                      <div className="h-12 bg-slate-100 rounded w-1/2 mb-8"></div>
                      <div className="grid grid-cols-4 gap-6 mb-8">
                        <div className="h-20 bg-slate-50 rounded-2xl"></div>
                        <div className="h-20 bg-slate-50 rounded-2xl"></div>
                        <div className="h-20 bg-slate-50 rounded-2xl"></div>
                        <div className="h-20 bg-slate-50 rounded-2xl"></div>
                      </div>
                      <div className="h-16 bg-slate-100 rounded-2xl"></div>
                    </div>
                  ))
                )}
             </div>
          </div>
          <div className="col-span-12 lg:col-span-4 space-y-6 lg:space-y-8">
             <div className="bg-white border border-slate-200 p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] shadow-sm">
                <h3 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-widest mb-8 lg:mb-10 flex items-center gap-3"><BrainCircuit className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" /> Mathematical Engine</h3>
                <div className="space-y-4 lg:space-y-6">
                  <div className="p-4 lg:p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase">Model Convergence</span>
                      <span className="text-[10px] lg:text-xs font-black text-emerald-600">{engineStats.convergence.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${engineStats.convergence}%` }}></div>
                    </div>
                  </div>
                  <div className="p-4 lg:p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase">Signal Entropy</span>
                      <span className="text-[10px] lg:text-xs font-black text-blue-600">{engineStats.entropy.toFixed(2)} bits</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${(engineStats.entropy / 0.5) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="p-4 lg:p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase">Forecast Skill (Avg)</span>
                      <span className="text-[10px] lg:text-xs font-black text-indigo-600">{engineStats.forecastSkill.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${engineStats.forecastSkill}%` }}></div>
                    </div>
                  </div>
                </div>
             </div>

             <div className="bg-white border border-slate-200 p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] shadow-sm">
                <h3 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-widest mb-8 lg:mb-10 flex items-center gap-3"><Globe2 className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" /> Neural Arbitrage</h3>
                {arbitrage?.length > 0 ? arbitrage.map((a, i) => (
                  <div key={i} className="p-4 lg:p-6 bg-slate-50 border border-slate-100 rounded-2xl mb-4 group hover:border-blue-200 transition-all">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-sm lg:text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">{a.asset}</span>
                       <span className="text-[10px] lg:text-xs font-black text-green-600">+{a.margin}</span>
                     </div>
                     <p className="text-[9px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-tight">{a.buyRegion} <ArrowRight className="inline w-3 h-3 mx-1" /> {a.sellRegion}</p>
                     <div className="mt-4 flex justify-between items-center text-[8px] lg:text-[9px] font-black text-slate-500 uppercase">
                        <span>Potential: {a.volumePotential}</span>
                        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Risk: {a.riskFactor}/100</span>
                     </div>
                  </div>
                )) : (
                  <div className="py-10 lg:py-20 text-center space-y-4">
                    <Radar className="w-8 h-8 lg:w-10 lg:h-10 text-slate-200 animate-pulse mx-auto" />
                    <p className="text-[9px] lg:text-[10px] font-black text-slate-300 uppercase">Probing Corridors...</p>
                  </div>
                )}
             </div>
             <MarketChart data={forecast} title={`${selectedSegment} Outlook`} />

             <div className="bg-white border border-slate-200 p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] shadow-sm">
                <h3 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-widest mb-8 lg:mb-10 flex items-center gap-3"><Zap className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" /> Neural News Feed</h3>
                <div className="space-y-6">
                  {news?.length > 0 ? news.slice(0, 5).map((article, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] lg:text-[10px] font-black text-blue-600 uppercase tracking-widest">{article.source}</span>
                        <span className="text-[8px] lg:text-[9px] font-bold text-slate-400 uppercase">{article.timestamp}</span>
                      </div>
                      <h4 className="text-xs lg:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">{article.title}</h4>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          article.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          article.sentiment === 'Negative' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-slate-50 text-slate-400 border border-slate-100'
                        }`}>
                          {article.sentiment}
                        </span>
                        <span className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase">Impact: {article.impactScore}</span>
                      </div>
                    </div>
                  )) : (
                    [1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                      </div>
                    ))
                  )}
                </div>
              </div>
          </div>
       </div>
    </div>
  );
};

export default DashboardView;
