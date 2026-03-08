
import React from 'react';
import { COAEntry, NeuralProcessLog } from '../types';
import { 
  FileCheck, Boxes, Database, Loader2, FileSearch, Terminal, 
  ShieldCheck, ExternalLink, Download, X, Sparkles, ToggleLeft, ToggleRight
} from 'lucide-react';

interface COALedgerViewProps {
  coaEntries: COAEntry[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  coaBatch: string;
  setCoaBatch: (val: string) => void;
  loading: boolean;
  deepScan: boolean;
  setDeepScan: (val: boolean) => void;
  probeStatus: string[];
  handleCOASearch: () => void;
  setSelectedCOA: (coa: COAEntry) => void;
  downloadCOAPDF: (coa: COAEntry) => void;
}

const COALedgerView: React.FC<COALedgerViewProps> = ({
  coaEntries,
  searchQuery,
  setSearchQuery,
  coaBatch,
  setCoaBatch,
  loading,
  deepScan,
  setDeepScan,
  probeStatus,
  handleCOASearch,
  setSelectedCOA,
  downloadCOAPDF
}) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
       <div className="bg-[#0c1220] border border-slate-800 p-12 rounded-[4rem] space-y-10 relative overflow-hidden group shadow-3xl">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="w-24 h-24 bg-emerald-600/10 rounded-full flex items-center justify-center shrink-0 ring-8 ring-emerald-600/5 shadow-2xl">
              <FileCheck className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Neural COA Vault</h2>
              <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Specification Grounding & Secure PDF Reconstruction</p>
            </div>
          </div>
          <div className="max-w-5xl flex flex-col md:flex-row gap-6 bg-[#050811] p-6 rounded-[2.5rem] border border-slate-800 shadow-3xl relative">
             <div className="flex-1 flex gap-4 px-4 items-center border-r border-slate-800/50">
                <Boxes className="w-6 h-6 text-slate-700" />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Asset Name..." 
                  className="flex-1 bg-transparent text-xl text-white outline-none font-bold" 
                />
             </div>
             <div className="flex-1 flex gap-4 px-4 items-center">
                <Database className="w-6 h-6 text-slate-700" />
                <input 
                  type="text" 
                  value={coaBatch} 
                  onChange={(e) => setCoaBatch(e.target.value)} 
                  placeholder="Lot/Batch#..." 
                  className="flex-1 bg-transparent text-xl text-white outline-none font-bold" 
                />
             </div>
             <button 
                onClick={handleCOASearch} 
                disabled={loading} 
                className={`relative bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 flex items-center gap-3 overflow-hidden ${loading ? 'opacity-80' : ''}`}
             >
               {loading && <div className="absolute inset-0 bg-emerald-500/20 animate-pulse"></div>}
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
               {loading ? 'RECONSTRUCTING...' : 'RECONSTRUCT'}
             </button>
          </div>

          <div className="flex items-center gap-6 px-4">
            <button 
              onClick={() => setDeepScan(!deepScan)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${deepScan ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
            >
              <Sparkles className={`w-4 h-4 ${deepScan ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">Deep Scan Mode</span>
              {deepScan ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            </button>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              {deepScan ? 'Neural probe using Gemini 3.1 Pro for intensive grounding' : 'Standard neural grounding active'}
            </p>
          </div>
          
          {loading && (
            <div className="bg-emerald-600/5 border border-emerald-500/10 p-6 rounded-[2rem] flex items-center gap-4 animate-in fade-in duration-500">
               <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-emerald-500" />
               </div>
               <div className="flex-1">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Neural Grounding Stream Active</p>
                  <p className="text-sm font-bold text-slate-300">{probeStatus[0] || 'Targeting technical nodes...'}</p>
               </div>
            </div>
          )}
       </div>

       {coaEntries.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
           {coaEntries.map((entry) => (
             <div key={entry.id} className="bg-[#0c1220] border border-slate-800 rounded-[3rem] p-10 flex flex-col relative group hover:border-emerald-500/50 transition-all shadow-2xl">
               <div className="flex justify-between items-start mb-8">
                 <div>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Digital Twin</span>
                    <h4 className="text-3xl font-black text-white group-hover:text-emerald-400 tracking-tighter leading-none mb-2 truncate mt-3">{entry.chemicalName}</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CAS: {entry.casNumber}</p>
                      {searchQuery.trim() === entry.casNumber.trim() && (
                        <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[8px] font-black uppercase border border-blue-500/20">Strict Match</span>
                      )}
                    </div>
                    {entry.labName && (
                      <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-2">Lab: {entry.labName}</p>
                    )}
                 </div>
                 <ShieldCheck className="w-8 h-8 text-emerald-500" />
               </div>
               <div className="space-y-4 mb-10 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                      <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Manufacturer</p>
                      <p className="text-xs font-bold text-white truncate">{entry.manufacturer}</p>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                      <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Grounding</p>
                      <p className="text-xs font-bold text-emerald-500">{entry.authenticityScore}% Score</p>
                    </div>
                  </div>
                  
                  {entry.originalPdfUrl && (
                    <a 
                      href={entry.originalPdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-[10px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-600/20 transition-all group/link"
                    >
                      <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                      Original Manufacturer PDF
                    </a>
                  )}

                  <div className="bg-slate-950/80 p-6 rounded-[2rem] border border-slate-800">
                     <p className="text-[9px] font-black text-slate-500 uppercase mb-4 tracking-widest">Extracted Specs</p>
                     <div className="space-y-2">
                       {entry.specifications.slice(0, 3).map((spec, i) => (
                         <div key={i} className="flex justify-between items-center text-[11px] font-bold">
                           <span className="text-slate-400">{spec.parameter}</span>
                           <span className="text-white">{spec.actualResult} {spec.unit}</span>
                         </div>
                       ))}
                     </div>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setSelectedCOA(entry)} className="flex-1 py-5 bg-slate-900 border border-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-colors">View Data</button>
                  <button onClick={() => downloadCOAPDF(entry)} className="flex-1 py-5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg hover:bg-emerald-500 transition-colors">Re-Export PDF</button>
               </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
};

export default COALedgerView;
