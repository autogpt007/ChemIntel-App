
import React from 'react';
import { GeopoliticalImpact } from '../types';
import { Globe, ShieldAlert, ArrowRight } from 'lucide-react';

interface GeopoliticalViewProps {
  geopoliticalData: GeopoliticalImpact[];
  syncing: boolean;
  handleLiveRecon: (query?: string) => void;
}

const GeopoliticalView: React.FC<GeopoliticalViewProps> = ({ 
  geopoliticalData, 
  syncing, 
  handleLiveRecon 
}) => {
  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="bg-[#0c1220] border border-slate-800 p-8 lg:p-12 rounded-[2rem] lg:rounded-[4rem] shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 hidden lg:block">
          <Globe className="w-64 h-64 text-blue-500 animate-pulse" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter mb-4">Geopolitical Impact Analysis</h2>
          <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[8px] lg:text-[10px]">High-Ranking Products Affected by Global Atmosphere</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {geopoliticalData.map((item) => (
          <div key={item.id} className="bg-[#0c1220] border border-slate-800 rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 flex flex-col relative group hover:border-blue-500/50 transition-all shadow-2xl">
            <div className="flex justify-between items-start mb-6 lg:mb-8">
              <div>
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  item.impactLevel === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                  item.impactLevel === 'Medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                  'bg-blue-500/10 text-blue-500 border-blue-500/20'
                }`}>
                  {item.impactLevel} Impact
                </span>
                <h4 className="text-2xl lg:text-3xl font-black text-white group-hover:text-blue-400 tracking-tighter leading-none mb-2 truncate mt-3">{item.productName}</h4>
                <p className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.region}</p>
              </div>
            </div>
            <div className="space-y-4 mb-8 lg:mb-10 flex-1">
              <div className="bg-slate-950/50 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-800/50">
                <p className="text-[9px] font-black text-slate-600 uppercase mb-2">Impact Reason</p>
                <p className="text-xs lg:text-sm font-bold text-slate-300 leading-relaxed">{item.reason}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div className="bg-slate-950/50 p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-slate-800/50">
                  <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Price Change</p>
                  <p className={`text-[10px] lg:text-xs font-bold ${item.priceChange.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{item.priceChange}</p>
                </div>
                <div className="bg-slate-950/50 p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-slate-800/50">
                  <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Supply Risk</p>
                  <p className="text-[10px] lg:text-xs font-bold text-white">{item.supplyRisk}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-slate-800">
               <span className={`text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${
                 item.sentiment === 'Positive' ? 'text-emerald-500' : 
                 item.sentiment === 'Negative' ? 'text-red-500' : 'text-slate-400'
               }`}>Sentiment: {item.sentiment}</span>
               <button onClick={() => handleLiveRecon(item.productName)} className="text-[9px] lg:text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors flex items-center gap-2">
                Deep Recon <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {geopoliticalData.length === 0 && (
        <div className="text-center py-20 lg:py-40 bg-slate-900/20 rounded-[2rem] lg:rounded-[4rem] border border-dashed border-slate-800">
          <Globe className={`w-12 h-12 lg:w-16 lg:h-16 text-slate-800 mx-auto mb-6 ${syncing ? 'animate-spin text-blue-500' : 'animate-pulse'}`} />
          <p className="text-lg lg:text-xl font-black text-slate-700 uppercase tracking-widest px-4">
            {syncing ? 'Synchronizing Global Atmosphere...' : 'Probing Global Atmosphere for Signals...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GeopoliticalView;
