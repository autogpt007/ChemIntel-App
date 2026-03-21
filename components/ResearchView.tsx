
import React from 'react';
import { HubIntel, NeuralProcessLog } from '../types';
import { 
  Search, Loader2, Terminal, HardDrive, Target, FlaskConical, 
  Globe2, Shield, Factory, Ship, Phone, Mail, MapPin, ExternalLink,
  Radar, Info, Scale, BookOpen, Lightbulb, TrendingUp, Zap, Calculator, Clock
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
  handleCOASearch: () => void;
  setActiveTab: (tab: string) => void;
  logs: NeuralProcessLog[];
  searchHistory: string[];
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
  handleCOASearch,
  setActiveTab,
  logs,
  searchHistory
}) => {
  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
       <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2">
            <Globe2 className="w-3 h-3" /> Search Grounded Intelligence
          </div>
          <div className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
            <Zap className="w-3 h-3" /> Live Neural Recon
          </div>
       </div>

       <div className="bg-white border border-slate-200 p-8 lg:p-12 rounded-[2rem] lg:rounded-[2.5rem] space-y-8 lg:space-y-10 relative overflow-hidden group shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-center">
            <div className="w-16 h-16 lg:w-24 lg:h-24 bg-blue-50 rounded-full flex items-center justify-center shrink-0 ring-4 lg:ring-8 ring-blue-50 shadow-sm">
              <Search className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-2">Intelligence Hub</h2>
              <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[8px] lg:text-[10px]">Real-time Market Recon & Node Verification</p>
            </div>
          </div>
          <div className="max-w-4xl flex flex-col md:flex-row gap-4 lg:gap-6 bg-slate-50 p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-200 shadow-sm relative">
             <div className="flex-1 flex gap-4 px-2 lg:px-4 items-center">
                <Search className="w-5 h-5 lg:w-6 lg:h-6 text-slate-300" />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Target Asset or Company..." 
                  className="flex-1 bg-transparent text-lg lg:text-xl text-slate-900 outline-none font-bold placeholder:text-slate-300" 
                />
             </div>
             <button 
                onClick={() => handleLiveRecon()} 
                disabled={loading} 
                className={`relative bg-blue-600 hover:bg-blue-700 text-white px-8 lg:px-12 py-4 lg:py-5 rounded-xl lg:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] lg:text-xs shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 overflow-hidden ${loading ? 'opacity-80' : ''}`}
             >
               {loading && <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>}
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radar className="w-4 h-4" />}
               {loading ? 'PROBING...' : 'LIVE RECON'}
             </button>
          </div>
          
          {loading && (
            <div className="bg-blue-50 border border-blue-100 p-4 lg:p-6 rounded-xl lg:rounded-2xl flex items-center gap-4 animate-in fade-in duration-500">
               <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Terminal className="w-5 h-5 text-blue-600" />
               </div>
               <div className="flex-1">
                  <p className="text-[9px] lg:text-[10px] font-black text-blue-600 uppercase tracking-widest animate-pulse">Neural Probe Active</p>
                  <p className="text-[13px] lg:text-sm font-bold text-slate-600">{probeStatus[0] || 'Targeting nodes...'}</p>
               </div>
            </div>
          )}

          {!loading && searchHistory.length > 0 && (
            <div className="space-y-4">
              <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Recon Missions</p>
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {searchHistory.map((h, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleLiveRecon(h)}
                    className="px-3 py-1.5 lg:px-4 lg:py-2 bg-slate-50 border border-slate-200 rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-bold text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center gap-2"
                  >
                    <Clock className="w-3 h-3" /> {h}
                  </button>
                ))}
              </div>
            </div>
          )}
       </div>

       {hubIntel ? (
         <div className="grid grid-cols-12 gap-6 lg:gap-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="col-span-12 lg:col-span-8 space-y-8 lg:space-y-10">
               <div className="bg-white border border-slate-200 rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-12 shadow-sm relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 lg:mb-12">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-4">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-widest border border-blue-100">Verified Asset</span>
                        <span className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">CAS: {hubIntel.casNumber}</span>
                        {hubIntel.category && (
                          <span className="text-[8px] lg:text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                            {hubIntel.category}
                          </span>
                        )}
                        {hubIntel.regulatoryStatus && (
                          <span className="text-[8px] lg:text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                            {hubIntel.regulatoryStatus}
                          </span>
                        )}
                        <button 
                          onClick={() => {
                            handleCOASearch();
                            setActiveTab('coa');
                          }}
                          className="px-2.5 py-1 bg-slate-900 text-white rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-widest border border-slate-800 flex items-center gap-2 hover:bg-slate-800 transition-all"
                        >
                          <FlaskConical className="w-3 h-3" /> Generate COA
                        </button>
                      </div>
                      <h3 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">{hubIntel.assetName}</h3>
                    </div>
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-50 rounded-xl lg:rounded-2xl border border-slate-200 flex items-center justify-center shrink-0">
                      <HardDrive className="w-8 h-8 lg:w-10 lg:h-10 text-slate-300" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-8 lg:mb-12">
                     <div className="p-4 lg:p-8 bg-slate-50 rounded-xl lg:rounded-2xl border border-slate-100">
                        <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase mb-2 lg:mb-4 tracking-widest">Market Status</p>
                        <div className="flex items-center gap-2 lg:gap-3">
                           <div className="w-2 h-2 lg:w-3 lg:h-3 bg-emerald-500 rounded-full"></div>
                           <p className="text-lg lg:text-2xl font-black text-slate-900">{hubIntel.marketStatus}</p>
                        </div>
                     </div>
                     <div className="p-4 lg:p-8 bg-slate-50 rounded-xl lg:rounded-2xl border border-slate-100">
                        <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase mb-2 lg:mb-4 tracking-widest">Global Supply</p>
                        <p className="text-lg lg:text-2xl font-black text-blue-600">{hubIntel.supplyLevel}</p>
                     </div>
                     <div className="p-4 lg:p-8 bg-slate-50 rounded-xl lg:rounded-2xl border border-slate-100">
                        <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase mb-2 lg:mb-4 tracking-widest">Price Index</p>
                        <p className="text-lg lg:text-2xl font-black text-slate-900">{hubIntel.priceIndex}</p>
                     </div>
                     <div className="p-4 lg:p-8 bg-slate-50 rounded-xl lg:rounded-2xl border border-slate-100">
                        <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase mb-2 lg:mb-4 tracking-widest">Forecast Skill</p>
                        <p className="text-lg lg:text-2xl font-black text-indigo-600">{hubIntel.forecastSkill || 0}%</p>
                     </div>
                  </div>

                  {hubIntel.peakSeason && (
                    <div className="mb-8 lg:mb-12 px-4 lg:px-8 py-3 lg:py-4 bg-orange-50 border border-orange-100 rounded-xl lg:rounded-2xl flex items-center gap-3 w-fit">
                      <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
                      <div>
                        <p className="text-[8px] lg:text-[10px] font-black text-orange-400 uppercase tracking-widest">Mathematical Peak Season</p>
                        <p className="text-base lg:text-lg font-black text-orange-600 uppercase">{hubIntel.peakSeason}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 lg:space-y-6">
                    <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Summary</p>
                    <p className="text-lg lg:text-xl font-bold text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-4 lg:pl-8 py-2">"{hubIntel.summary}"</p>
                  </div>

                  {hubIntel.primaryApplications && hubIntel.primaryApplications.length > 0 && (
                    <div className="mt-8 lg:mt-10 pt-8 lg:pt-10 border-t border-slate-100">
                      <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 lg:mb-6">Primary Applications</p>
                      <div className="flex flex-wrap gap-2 lg:gap-3">
                        {hubIntel.primaryApplications.map((app, i) => (
                          <span key={i} className="px-3 py-1.5 lg:px-4 lg:py-2 bg-slate-50 border border-slate-100 rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-bold text-slate-500 group-hover:border-blue-200 transition-all">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
               </div>

               {hubIntel.procurementAdvice && (
                 <div className="bg-blue-50 border border-blue-100 rounded-[1.5rem] lg:rounded-[2.5rem] p-8 lg:p-12 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 lg:p-10 opacity-10">
                      <Lightbulb className="w-24 h-24 lg:w-40 lg:h-40 text-blue-600" />
                    </div>
                    <h4 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter uppercase tracking-widest mb-6 lg:mb-8 flex items-center gap-3">
                      <Lightbulb className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" /> Strategic Procurement Advice
                    </h4>
                    <p className="text-base lg:text-lg font-bold text-slate-700 leading-relaxed relative z-10">
                      {hubIntel.procurementAdvice}
                    </p>
                 </div>
               )}

               {hubIntel.pricingTrendSummary && (
                 <div className="bg-white border border-slate-200 rounded-[1.5rem] lg:rounded-[2.5rem] p-8 lg:p-12 shadow-sm">
                    <h4 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter uppercase tracking-widest mb-6 lg:mb-8 flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" /> Pricing Trend Analysis
                     </h4>
                     <p className="text-base lg:text-lg font-bold text-slate-600 leading-relaxed">
                       {hubIntel.pricingTrendSummary}
                     </p>
                  </div>
                )}

                <div className="bg-white border border-slate-200 rounded-[1.5rem] lg:rounded-[2.5rem] p-8 lg:p-12 shadow-sm">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 lg:mb-10">
                     <h4 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter uppercase tracking-widest">Verified Suppliers</h4>
                     <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black text-slate-400 uppercase">{hubIntel.manufacturers.length} Nodes Found</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                     {hubIntel.manufacturers?.map((m, i) => (
                       <div key={i} className="p-6 lg:p-8 bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl group hover:border-emerald-200 transition-all">
                         <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                           <div className="flex-1">
                             <p className="text-base lg:text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{m.name}</p>
                             <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase">{m.country}</span>
                           </div>
                           <div className="text-left sm:text-right flex flex-col items-start sm:items-end gap-2 shrink-0">
                             <p className="text-[10px] lg:text-[11px] font-mono font-bold text-blue-600 break-all">{m.contact?.email || 'N/A'}</p>
                             <button 
                               onClick={() => handleGenerateRFQ(m)}
                               className="px-3 py-1.5 lg:px-4 lg:py-2 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-all"
                             >
                               Draft RFQ
                             </button>
                           </div>
                         </div>
                         <div className="flex gap-4 pt-4 lg:pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase">
                               <Shield className="w-3 h-3 text-emerald-500" /> Verified
                            </div>
                            <div className="flex items-center gap-2 text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase">
                               <Globe2 className="w-3 h-3 text-blue-500" /> Active
                            </div>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>

               {hubIntel.buyers && hubIntel.buyers.length > 0 && (
                 <div className="bg-white border border-slate-200 rounded-[1.5rem] lg:rounded-[2.5rem] p-8 lg:p-12 shadow-sm">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 lg:mb-10">
                     <h4 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter uppercase tracking-widest">Potential Buyers</h4>
                     <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black text-slate-400 uppercase">{hubIntel.buyers.length} Nodes Identified</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                     {hubIntel.buyers.map((b, i) => (
                       <div key={i} className="p-6 lg:p-8 bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl group hover:border-blue-200 transition-all">
                         <div className="flex justify-between items-start mb-4">
                           <div>
                             <p className="text-base lg:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{b.name}</p>
                             <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase">{b.country}</span>
                           </div>
                           <div className="text-right">
                             <p className="text-[9px] lg:text-[10px] font-black text-blue-600 uppercase tracking-widest">Target Vol.</p>
                             <p className="text-[11px] lg:text-xs font-bold text-slate-600">{b.annualVolume || 'Neural Est.'}</p>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6 lg:space-y-8">
               <div className="bg-white border border-slate-200 rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-10 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-6 lg:p-8 opacity-5">
                    <Target className="w-24 h-24 lg:w-32 lg:h-32 text-blue-600" />
                  </div>
                  <h4 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-widest mb-6 lg:mb-8 flex items-center gap-3"><FlaskConical className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" /> Technical Nodes</h4>
                  <div className="space-y-3 lg:space-y-4">
                    {hubIntel.technicalSpecs?.map((spec, i) => (
                      <div key={i} className="flex justify-between items-center p-4 lg:p-5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase">{spec.label}</span>
                        <span className="text-[11px] lg:text-xs font-bold text-slate-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
               </div>

                {hubIntel.substitutionOptions && hubIntel.substitutionOptions.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-10 shadow-sm">
                    <h4 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-widest mb-6 lg:mb-8 flex items-center gap-3">
                      <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-500" /> Substitution Options
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {hubIntel.substitutionOptions.map((opt, i) => (
                        <span key={i} className="px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] lg:text-[10px] font-bold text-slate-500">
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hubIntel.importRequirements && hubIntel.importRequirements.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-10 shadow-sm">
                    <h4 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-widest mb-6 lg:mb-8 flex items-center gap-3">
                      <Scale className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" /> Global Import Requirements
                    </h4>
                    <div className="space-y-4 lg:space-y-6">
                      {hubIntel.importRequirements.map((req, i) => (
                        <div key={i} className="p-4 lg:p-6 bg-slate-50 rounded-xl border border-slate-100 group hover:border-emerald-200 transition-all">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[13px] lg:text-sm font-black text-slate-900">{req.country}</span>
                            <span className="text-[8px] lg:text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                              Duty: {req.dutyEstimate}
                            </span>
                          </div>
                          <p className="text-[11px] lg:text-xs text-slate-500 leading-relaxed">
                            {req.requirements}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white border border-slate-200 rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-10 shadow-sm">
                   <h4 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-widest mb-6 lg:mb-8 flex items-center gap-3"><Terminal className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" /> Neural Process Log</h4>
                   <div className="space-y-3 lg:space-y-4 font-mono">
                     {logs.slice(0, 8).map((log, i) => (
                       <div key={i} className="text-[9px] lg:text-[10px] leading-relaxed">
                         <span className="text-slate-400">[{log.timestamp}]</span>
                         <span className={`ml-2 font-bold ${
                           log.level === 'SUCCESS' ? 'text-emerald-600' : 
                           log.level === 'WARNING' ? 'text-orange-600' : 
                           log.level === 'ERROR' ? 'text-red-600' :
                           'text-blue-600'
                         }`}>{log.message}</span>
                       </div>
                     ))}
                   </div>
                </div>
            </div>
         </div>
       ) : (
         <div className="flex flex-col items-center justify-center py-24 lg:py-40 bg-slate-50 rounded-[2rem] lg:rounded-[4rem] border border-dashed border-slate-200 px-6 text-center">
            <Radar className="w-16 h-16 lg:w-24 lg:h-24 text-slate-200 mb-6 lg:mb-8 animate-pulse" />
            <p className="text-xl lg:text-2xl font-black text-slate-300 uppercase tracking-widest">Awaiting Target Parameters</p>
            <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase mt-4">Enter an asset name above to begin neural market reconstruction.</p>
         </div>
       )}
    </div>
  );
};

export default ResearchView;
