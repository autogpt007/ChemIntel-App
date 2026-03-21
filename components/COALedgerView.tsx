
import React, { useState, useEffect, useRef } from 'react';
import { COAEntry, NeuralProcessLog } from '../types';
import { 
  FileCheck, Boxes, Database, Loader2, FileSearch, Terminal, 
  ShieldCheck, ExternalLink, Download, X, Sparkles, ToggleLeft, ToggleRight,
  Search, History, ChevronRight, FlaskConical, Eye
} from 'lucide-react';
import { agentService } from '../services/agentService';

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery && searchQuery.length >= 2) {
        const results = await agentService.getSuggestions(searchQuery);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    // Optionally fire search immediately
    // handleCOASearch(); 
  };

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
             <div className="flex-1 flex gap-4 px-4 items-center border-r border-slate-800/50 relative">
                <Boxes className="w-6 h-6 text-slate-700" />
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                    placeholder="Asset Name or CAS#..." 
                    className="w-full bg-transparent text-xl text-white outline-none font-bold" 
                  />
                  
                  {showSuggestions && (
                    <div 
                      ref={suggestionRef}
                      className="absolute top-full left-0 right-0 mt-6 bg-[#0c1220] border border-slate-800 rounded-3xl shadow-3xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                    >
                      <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-blue-500" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Suggestions</span>
                      </div>
                      {suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full px-6 py-4 text-left text-sm font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-between group"
                        >
                          <span>{suggestion}</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
             </div>
             <div className="flex-1 flex gap-4 px-4 items-center">
                <Database className="w-6 h-6 text-slate-700" />
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={coaBatch} 
                    onChange={(e) => setCoaBatch(e.target.value)} 
                    placeholder="Lot/Batch# (Optional)..." 
                    className="w-full bg-transparent text-xl text-white outline-none font-bold" 
                  />
                  {!coaBatch && !loading && (
                    <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mt-1 animate-pulse">
                      Auto-Discovery Agent Active
                    </p>
                  )}
                </div>
             </div>
             <button 
                onClick={handleCOASearch} 
                disabled={loading || !searchQuery} 
                className={`relative bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 flex items-center gap-3 overflow-hidden ${loading || !searchQuery ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
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
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
           {coaEntries.map((entry) => (
             <div key={entry.id} className="bg-[#0c1220] border border-slate-800 rounded-[3rem] p-8 md:p-10 flex flex-col relative group hover:border-emerald-500/50 transition-all shadow-2xl overflow-hidden">
               {/* Decorative Background Element */}
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>
               
               <div className="flex justify-between items-start mb-8 relative z-10">
                 <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Digital Twin</span>
                      {entry.vetted && (
                        <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-500/20 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Vetted
                        </span>
                      )}
                      {entry.isStandardized && (
                        <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">Standardized</span>
                      )}
                    </div>
                    <h4 className="text-2xl md:text-3xl font-black text-white group-hover:text-emerald-400 tracking-tighter leading-tight mb-2 truncate" title={entry.chemicalName}>
                      {entry.chemicalName}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CAS: <span className="text-blue-400">{entry.casNumber || 'N/A'}</span></p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Batch: <span className="text-emerald-400">{entry.batchNumber || 'N/A'}</span></p>
                      {searchQuery && entry.casNumber && searchQuery.trim() === entry.casNumber.trim() && (
                        <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[8px] font-black uppercase border border-blue-500/20">Strict Match</span>
                      )}
                    </div>
                    {entry.catNumber && (
                      <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-2">CAT: {entry.catNumber}</p>
                    )}
                 </div>
                 <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    </div>
                    {entry.stampUrl && (
                      <img 
                        src={entry.stampUrl} 
                        alt="Lab Stamp" 
                        className="w-16 h-16 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                    )}
                 </div>
               </div>

               <div className="space-y-6 mb-10 flex-1 relative z-10">
                  {/* Identification Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 group-hover:border-slate-700 transition-colors">
                      <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Formula</p>
                      <p className="text-[11px] font-bold text-white truncate">{entry.molecularFormula || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 group-hover:border-slate-700 transition-colors">
                      <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Weight</p>
                      <p className="text-[11px] font-bold text-white truncate">{entry.molecularWeight || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 group-hover:border-slate-700 transition-colors">
                      <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Manufacturer</p>
                      <p className="text-[11px] font-bold text-white truncate">{entry.manufacturer || 'Unknown'}</p>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 group-hover:border-slate-700 transition-colors">
                      <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Grounding</p>
                      <p className="text-[11px] font-bold text-emerald-500">{entry.authenticityScore}% Score</p>
                    </div>
                  </div>
                  
                  {/* Analytical Summary */}
                  <div className="bg-slate-950/80 p-6 rounded-[2rem] border border-slate-800 group-hover:border-slate-700 transition-all">
                     <div className="flex justify-between items-center mb-4">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Analytical Profile</p>
                       <FlaskConical className="w-3 h-3 text-slate-700" />
                     </div>
                     <div className="space-y-3">
                       <div className="flex justify-between items-center text-[11px] font-bold">
                         <span className="text-slate-500">Purity</span>
                         <span className="text-emerald-500">{entry.analyticalInfo?.purityByHPLC || entry.purity || 'N/A'}</span>
                       </div>
                       <div className="flex justify-between items-center text-[11px] font-bold">
                         <span className="text-slate-500">Description</span>
                         <span className="text-white truncate max-w-[120px]">{entry.analyticalInfo?.description || 'N/A'}</span>
                       </div>
                       <div className="flex justify-between items-center text-[11px] font-bold">
                         <span className="text-slate-500">Solubility</span>
                         <span className="text-white truncate max-w-[120px]">{entry.analyticalInfo?.solubility || 'N/A'}</span>
                       </div>
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
               </div>

               <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                  <button 
                    onClick={() => setSelectedCOA(entry)} 
                    className="flex-1 py-5 bg-slate-900 border border-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> View Data
                  </button>
                  <button 
                    onClick={() => downloadCOAPDF(entry)} 
                    className="flex-1 py-5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Export PDF
                  </button>
               </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
};

export default COALedgerView;
