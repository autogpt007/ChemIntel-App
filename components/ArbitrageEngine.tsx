
import React from 'react';
import { ArbitrageOpportunity } from '../types';
import { TrendingUp, ArrowRight, ShieldAlert, Zap, Globe, DollarSign, Package } from 'lucide-react';

interface ArbitrageEngineProps {
  opportunities: ArbitrageOpportunity[];
  loading: boolean;
  onRefresh?: () => void;
}

const ArbitrageEngine: React.FC<ArbitrageEngineProps> = ({ opportunities, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Scanning Global Price Discrepancies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-700">
      <div className="bg-[#0c1220] border border-slate-800 p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 lg:p-10 opacity-5">
          <Zap className="w-32 h-32 lg:w-64 lg:h-64 text-yellow-500" />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 lg:mb-12 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
              <span className="text-[8px] lg:text-[10px] font-black text-yellow-500 uppercase tracking-widest">Live Arbitrage Stream</span>
              <span className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[7px] lg:text-[8px] font-black uppercase rounded-md flex items-center gap-1">
                <Globe className="w-2 h-2" /> Council of Experts Active
              </span>
            </div>
            <h3 className="text-3xl lg:text-5xl font-black text-white tracking-tighter">Neural Trading Floor</h3>
            <p className="text-slate-500 font-black uppercase tracking-widest text-[8px] lg:text-[10px] mt-2">Identifying Cross-Regional Price Anomalies</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[8px] lg:text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Opportunities</p>
            <p className="text-3xl lg:text-4xl font-black text-white">{opportunities.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:gap-6 relative z-10">
          {opportunities.map((opp) => (
            <div key={opp.id} className="group bg-slate-900/40 border border-slate-800 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] hover:border-yellow-500/30 transition-all hover:bg-slate-900/60">
              <div className="grid grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Asset Info */}
                <div className="col-span-12 lg:col-span-3">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-500/10 rounded-xl lg:rounded-2xl flex items-center justify-center border border-yellow-500/20 shrink-0">
                      <Package className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="text-lg lg:text-xl font-black text-white group-hover:text-yellow-400 transition-colors">{opp.asset}</h4>
                      <p className="text-[8px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Arbitrage</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-1 rounded-lg text-[7px] lg:text-[8px] font-black uppercase tracking-widest border ${
                      opp.logisticsComplexity === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      opp.logisticsComplexity === 'Medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      Logistics: {opp.logisticsComplexity}
                    </span>
                    <span className="px-2 py-1 bg-slate-800/50 text-slate-400 rounded-lg text-[7px] lg:text-[8px] font-black uppercase tracking-widest border border-slate-700/50">
                      Risk: {opp.riskFactor}%
                    </span>
                  </div>
                </div>

                {/* Price Bridge */}
                <div className="col-span-12 lg:col-span-5">
                  <div className="flex items-center justify-between bg-slate-950/50 p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-slate-800/50">
                    <div className="text-center flex-1">
                      <p className="text-[8px] lg:text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Buy: {opp.buyRegion}</p>
                      <p className="text-xl lg:text-2xl font-black text-white">{opp.buyPrice}</p>
                    </div>
                    <div className="px-4 lg:px-6 flex flex-col items-center shrink-0">
                      <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500 animate-pulse" />
                      <span className="text-[7px] lg:text-[8px] font-black text-yellow-500 uppercase mt-1">Spread</span>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-[8px] lg:text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Sell: {opp.sellRegion}</p>
                      <p className="text-xl lg:text-2xl font-black text-white">{opp.sellPrice}</p>
                    </div>
                  </div>
                </div>

                {/* Margin & Action */}
                <div className="col-span-12 lg:col-span-4 flex flex-row lg:flex-row items-center justify-between lg:justify-end gap-4 lg:gap-8">
                  <div className="text-left lg:text-right">
                    <p className="text-[8px] lg:text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center lg:justify-end gap-1">
                      <TrendingUp className="w-3 h-3" /> Net Margin
                    </p>
                    <p className="text-3xl lg:text-4xl font-black text-emerald-400 tracking-tighter">{opp.margin}</p>
                    <p className="text-[9px] lg:text-[10px] font-bold text-slate-500 italic mt-1">Est. Profit: {opp.profitPerTon}/ton</p>
                  </div>
                  <button className="bg-white text-black px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black uppercase tracking-widest text-[9px] lg:text-[10px] hover:bg-yellow-500 hover:text-black transition-all active:scale-95 shadow-xl shrink-0">
                    Execute
                  </button>
                </div>
              </div>

              {/* Reasoning Dropdown (Simplified) */}
              <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-slate-800/50">
                <p className="text-[10px] lg:text-[11px] text-slate-400 font-medium leading-relaxed italic">
                  <span className="text-yellow-500 font-black uppercase mr-2">Neural Logic:</span>
                  {opp.reasoning}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] space-y-4">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
            <Globe className="w-5 h-5 text-blue-500" />
          </div>
          <h5 className="text-lg font-black text-white">Regional Imbalance</h5>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">Current energy cost disparities between the EU and North America are creating a 15-22% margin window for ammonia-based derivatives.</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] space-y-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <h5 className="text-lg font-black text-white">Currency Arbitrage</h5>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">USD/CNY fluctuations have opened a temporary sourcing advantage for Chinese specialty polymers when settled in local currency via Hong Kong hubs.</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] space-y-4">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <h5 className="text-lg font-black text-white">Risk Mitigation</h5>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">High-margin opportunities often carry hidden demurrage risks. Our engine factors in current port congestion levels at Rotterdam and Shanghai.</p>
        </div>
      </div>
    </div>
  );
};

export default ArbitrageEngine;
