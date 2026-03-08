
import React from 'react';
import { HubIntel, NeuralProcessLog } from '../types';
import { 
  Search, Loader2, Terminal, HardDrive, Target, FlaskConical, 
  Globe2, Shield, Factory, Ship, Phone, Mail, MapPin, ExternalLink,
  Radar, Info, Scale, BookOpen, Lightbulb, TrendingUp, Zap
} from 'lucide-react';

interface ResearchViewProps {
  selectedRegion: string;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  loading: boolean;
  hubIntel: HubIntel | null;
  probeStatus: string[];
  handleLiveRecon: (query?: string) => void;
  handleGenerateRFQ: (vendor: any) => void;
  setActiveTab: (tab: string) => void;
  logs: NeuralProcessLog[];
}

const ResearchView: React.FC<ResearchViewProps> = ({
  selectedRegion,
  searchQuery,
  setSearchQuery,
  loading,
  hubIntel,
  probeStatus,
  handleLiveRecon,
  handleGenerateRFQ,
  setActiveTab,
  logs
}) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
       <div className="flex items-center gap-2 mb-4">
          <div className="px-3 py-1 bg-blue-600/10 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 flex items-center gap-2">
            <Globe2 className="w-3 h-3" /> Search Grounded Intelligence
          </div>
          <div className="px-3 py-1 bg-emerald-600/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
            <Zap className="w-3 h-3" /> Live Neural Recon
          </div>
       </div>

       <div className="bg-[#0c1220] border border-slate-800 p-12 rounded-[4rem] space-y-10 relative overflow-hidden group shadow-3xl">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center shrink-0 ring-8 ring-blue-600/5 shadow-2xl">
              <Search className="w-10 h-10 text-blue-500" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Intelligence Hub</h2>
              <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Real-time Market Recon & Node Verification</p>
            </div>
          </div>
          <div className="max-w-4xl flex flex-col md:flex-row gap-6 bg-[#050811] p-6 rounded-[2.5rem] border border-slate-800 shadow-3xl relative">
             <div className="flex-1 flex gap-4 px-4 items-center">
                <Search className="w-6 h-6 text-slate-700" />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Target Asset or Company..." 
                  className="flex-1 bg-transparent text-xl text-white outline-none font-bold" 
                />
             </div>
             <button 
                onClick={() => handleLiveRecon()} 
                disabled={loading} 
                className={`relative bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 flex items-center gap-3 overflow-hidden ${loading ? 'opacity-80' : ''}`}
             >
               {loading && <div className="absolute inset-0 bg-blue-500/20 animate-pulse"></div>}
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radar className="w-4 h-4" />}
               {loading ? 'PROBING...' : 'LIVE RECON'}
             </button>
          </div>
          
          {loading && (
            <div className="bg-blue-600/5 border border-blue-500/10 p-6 rounded-[2rem] flex items-center gap-4 animate-in fade-in duration-500">
               <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-blue-500" />
               </div>
               <div className="flex-1">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">Neural Probe Active</p>
                  <p className="text-sm font-bold text-slate-300">{probeStatus[0] || 'Targeting nodes...'}</p>
               </div>
            </div>
          )}
       </div>

       {hubIntel ? (
         <div className="grid grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="col-span-12 lg:col-span-8 space-y-10">
               <div className="bg-[#0c1220] border border-slate-800 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-blue-600/10 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Verified Asset</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CAS: {hubIntel.casNumber}</span>
                        {hubIntel.regulatoryStatus && (
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                            {hubIntel.regulatoryStatus}
                          </span>
                        )}
                      </div>
                      <h3 className="text-6xl font-black text-white tracking-tighter leading-none">{hubIntel.assetName}</h3>
                    </div>
                    <div className="w-20 h-20 bg-slate-900 rounded-[2rem] border border-slate-800 flex items-center justify-center">
                      <HardDrive className="w-10 h-10 text-slate-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                     <div className="p-8 bg-slate-950/50 rounded-[2.5rem] border border-slate-800/50">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Market Status</p>
                        <div className="flex items-center gap-3">
                           <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                           <p className="text-2xl font-black text-white">{hubIntel.marketStatus}</p>
                        </div>
                     </div>
                     <div className="p-8 bg-slate-950/50 rounded-[2.5rem] border border-slate-800/50">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Global Supply</p>
                        <p className="text-2xl font-black text-blue-400">{hubIntel.supplyLevel}</p>
                     </div>
                     <div className="p-8 bg-slate-950/50 rounded-[2.5rem] border border-slate-800/50">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Price Index</p>
                        <p className="text-2xl font-black text-white">{hubIntel.priceIndex}</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Neural Summary</p>
                    <p className="text-xl font-bold text-slate-300 leading-relaxed italic">"{hubIntel.summary}"</p>
                  </div>

                  {hubIntel.primaryApplications && hubIntel.primaryApplications.length > 0 && (
                    <div className="mt-10 pt-10 border-t border-slate-800/50">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Primary Applications</p>
                      <div className="flex flex-wrap gap-3">
                        {hubIntel.primaryApplications.map((app, i) => (
                          <span key={i} className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 group-hover:border-blue-500/30 transition-all">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
               </div>

               {hubIntel.procurementAdvice && (
                 <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                      <Lightbulb className="w-40 h-40 text-blue-500" />
                    </div>
                    <h4 className="text-2xl font-black text-white tracking-tighter uppercase tracking-widest mb-8 flex items-center gap-3">
                      <Lightbulb className="w-6 h-6 text-yellow-500" /> Strategic Procurement Advice
                    </h4>
                    <p className="text-lg font-bold text-slate-300 leading-relaxed relative z-10">
                      {hubIntel.procurementAdvice}
                    </p>
                 </div>
               )}

               {hubIntel.pricingTrendSummary && (
                 <div className="bg-[#0c1220] border border-slate-800 rounded-[4rem] p-12 shadow-2xl">
                    <h4 className="text-2xl font-black text-white tracking-tighter uppercase tracking-widest mb-8 flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-blue-500" /> Pricing Trend Analysis
                    </h4>
                    <p className="text-lg font-bold text-slate-300 leading-relaxed">
                      {hubIntel.pricingTrendSummary}
                    </p>
                 </div>
               )}

               <div className="bg-[#0c1220] border border-slate-800 rounded-[4rem] p-12 shadow-2xl">
                  <div className="flex justify-between items-center mb-10">
                    <h4 className="text-2xl font-black text-white tracking-tighter uppercase tracking-widest">Verified Suppliers</h4>
                    <span className="px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-500 uppercase">{hubIntel.manufacturers.length} Nodes Found</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hubIntel.manufacturers?.map((m, i) => (
                      <div key={i} className="p-8 bg-slate-950/50 border border-slate-800 rounded-[2.5rem] group hover:border-emerald-500/30 transition-all">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">{m.name}</p>
                            <span className="text-[10px] font-black text-slate-500 uppercase">{m.country}</span>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <p className="text-[11px] font-mono font-bold text-blue-400">{m.contact?.email || 'N/A'}</p>
                            <button 
                              onClick={() => handleGenerateRFQ(m)}
                              className="px-4 py-2 bg-blue-600/10 text-blue-500 text-[8px] font-black uppercase tracking-widest rounded-lg border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all"
                            >
                              Draft RFQ
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-4 pt-6 border-t border-slate-800/50">
                           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                              <Shield className="w-3 h-3 text-emerald-500" /> Verified
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                              <Globe2 className="w-3 h-3 text-blue-500" /> Active
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {hubIntel.buyers && hubIntel.buyers.length > 0 && (
                 <div className="bg-[#0c1220] border border-slate-800 rounded-[4rem] p-12 shadow-2xl">
                   <div className="flex justify-between items-center mb-10">
                     <h4 className="text-2xl font-black text-white tracking-tighter uppercase tracking-widest">Potential Buyers</h4>
                     <span className="px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-500 uppercase">{hubIntel.buyers.length} Nodes Identified</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {hubIntel.buyers.map((b, i) => (
                       <div key={i} className="p-8 bg-slate-950/50 border border-slate-800 rounded-[2.5rem] group hover:border-blue-500/30 transition-all">
                         <div className="flex justify-between items-start mb-4">
                           <div>
                             <p className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">{b.name}</p>
                             <span className="text-[10px] font-black text-slate-500 uppercase">{b.country}</span>
                           </div>
                           <div className="text-right">
                             <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Target Vol.</p>
                             <p className="text-xs font-bold text-slate-300">{b.annualVolume || 'Neural Est.'}</p>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-8">
               <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Target className="w-32 h-32 text-blue-500" />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3"><FlaskConical className="w-5 h-5 text-blue-500" /> Technical Nodes</h4>
                  <div className="space-y-4">
                    {hubIntel.technicalSpecs?.map((spec, i) => (
                      <div key={i} className="flex justify-between items-center p-5 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                        <span className="text-[10px] font-black text-slate-500 uppercase">{spec.label}</span>
                        <span className="text-xs font-bold text-white">{spec.value}</span>
                      </div>
                    ))}
                  </div>
               </div>

                {hubIntel.substitutionOptions && hubIntel.substitutionOptions.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-indigo-500" /> Substitution Options
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {hubIntel.substitutionOptions.map((opt, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-950/50 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400">
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hubIntel.importRequirements && hubIntel.importRequirements.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl mb-8">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                      <Scale className="w-5 h-5 text-emerald-500" /> Global Import Requirements
                    </h4>
                    <div className="space-y-6">
                      {hubIntel.importRequirements.map((req, i) => (
                        <div key={i} className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800/50 group hover:border-emerald-500/30 transition-all">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-black text-white">{req.country}</span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                              Duty: {req.dutyEstimate}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {req.requirements}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl">
                   <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3"><Terminal className="w-5 h-5 text-emerald-500" /> Neural Process Log</h4>
                   <div className="space-y-4 font-mono">
                     {logs.slice(0, 8).map((log, i) => (
                       <div key={i} className="text-[10px] leading-relaxed">
                         <span className="text-slate-600">[{log.timestamp}]</span>
                         <span className={`ml-2 font-bold ${
                           log.level === 'SUCCESS' ? 'text-emerald-500' : 
                           log.level === 'WARNING' ? 'text-orange-500' : 
                           log.level === 'ERROR' ? 'text-red-500' :
                           'text-blue-500'
                         }`}>{log.message}</span>
                       </div>
                     ))}
                   </div>
                </div>
            </div>
         </div>
       ) : (
         <div className="flex flex-col items-center justify-center py-40 bg-slate-900/20 rounded-[4rem] border border-dashed border-slate-800">
            <Radar className="w-24 h-24 text-slate-800 mb-8 animate-pulse" />
            <p className="text-2xl font-black text-slate-700 uppercase tracking-widest">Awaiting Target Parameters</p>
            <p className="text-xs font-bold text-slate-500 uppercase mt-4">Enter an asset name above to begin neural market reconstruction.</p>
         </div>
       )}
    </div>
  );
};

export default ResearchView;
