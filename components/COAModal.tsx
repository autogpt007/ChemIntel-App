
import React from 'react';
import { COAEntry } from '../types';
import { X, ShieldCheck, Download, ExternalLink, FlaskConical, Beaker, Clipboard, Info, Terminal } from 'lucide-react';

interface COAModalProps {
  coa: COAEntry;
  onClose: () => void;
  onDownload: (coa: COAEntry) => void;
}

const COAModal: React.FC<COAModalProps> = ({ coa, onClose, onDownload }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[500] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="bg-[#0c1220] border border-slate-800 w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-3xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 md:p-12 border-b border-slate-800 flex justify-between items-start bg-slate-950/50">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Verified Digital Twin</span>
                  {coa.vetted && (
                    <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-500/20 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" /> Neural Vetted
                    </span>
                  )}
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter mt-1">{coa.chemicalName}</h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2">
                <span className="text-slate-700">CAS:</span>
                <span className="text-blue-400">{coa.casNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-700">Batch:</span>
                <span className="text-white">{coa.batchNumber}</span>
              </div>
              {coa.catNumber && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-700">CAT:</span>
                  <span className="text-white">{coa.catNumber}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => onDownload(coa)}
              className="p-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-500 transition-all shadow-lg group"
              title="Download PDF"
            >
              <Download className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
            </button>
            <button 
              onClick={onClose}
              className="p-4 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar space-y-12">
          {/* Identification & Analytical Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              {/* Agentic Stack Status */}
              <div className="bg-slate-950/50 border border-slate-800 rounded-[2rem] p-8 space-y-6">
                <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Terminal className="w-4 h-4" /> Heisenberg Agentic Stack
                </h3>
                <div className="flex flex-wrap gap-3">
                  {coa.agenticStack && Object.entries(coa.agenticStack).map(([agent, active]) => (
                    <div key={agent} className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all ${active ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                      <span className="text-[9px] font-black uppercase tracking-widest">{agent.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory & Safety */}
              {coa.regulatory && (
                <div className="bg-red-500/5 border border-red-500/10 rounded-[2rem] p-8 space-y-6">
                  <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.2em] flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" /> Regulatory & Safety (Agent 03)
                  </h3>
                  <div className="space-y-6">
                    {coa.regulatory.ghsPictograms && coa.regulatory.ghsPictograms.length > 0 && (
                      <div className="flex flex-wrap gap-4">
                        {coa.regulatory.ghsPictograms.map((pic, idx) => (
                          <div key={idx} className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center border border-slate-200">
                            <img src={`https://pubchem.ncbi.nlm.nih.gov/images/ghs/${pic}.png`} alt={pic} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="space-y-2">
                      {coa.regulatory.hazardStatements?.map((h, idx) => (
                        <p key={idx} className="text-[10px] font-bold text-red-400/80 leading-relaxed">• {h}</p>
                      ))}
                    </div>
                    {coa.regulatory.reachStatus && (
                      <div className="pt-4 border-t border-red-500/10">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">REACH Status</p>
                        <p className="text-xs font-bold text-white">{coa.regulatory.reachStatus}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-slate-950/50 border border-slate-800 rounded-[2rem] p-8 space-y-6">
                <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Clipboard className="w-4 h-4" /> Identification Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Molecular Formula</p>
                    <p className="text-sm font-bold text-white">{coa.molecularFormula || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Molecular Weight</p>
                    <p className="text-sm font-bold text-white">{coa.molecularWeight || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Synonyms / Alternative Names</p>
                    <div className="flex flex-wrap gap-2">
                      {(coa.synonyms || 'N/A').split(',').map((syn, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-slate-300">
                          {syn.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/50 border border-slate-800 rounded-[2rem] p-8 space-y-6">
                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-3">
                  <FlaskConical className="w-4 h-4" /> Analytical Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Description</span>
                    <span className="text-xs font-bold text-white">{coa.analyticalInfo?.description || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Solubility</span>
                    <span className="text-xs font-bold text-white">{coa.analyticalInfo?.solubility || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Purity (HPLC)</span>
                    <span className="text-xs font-bold text-emerald-500">{coa.analyticalInfo?.purityByHPLC || coa.purity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                    <span className="text-[10px] font-black text-slate-500 uppercase">MASS (LCMS)</span>
                    <span className="text-xs font-bold text-white">{coa.analyticalInfo?.massByLCMS || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase">H1NMR</span>
                    <span className="text-xs font-bold text-white">{coa.analyticalInfo?.h1NMR || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications Table */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-[2rem] p-8 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Beaker className="w-4 h-4" /> Technical Specifications
                </h3>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Grounded Results</span>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 px-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                  <div className="col-span-1">Parameter</div>
                  <div>Unit</div>
                  <div>Standard</div>
                  <div className="text-right">Result</div>
                </div>
                <div className="space-y-2">
                  {coa.specifications?.length > 0 ? (
                    coa.specifications.map((spec, i) => (
                      <div key={i} className="grid grid-cols-4 gap-4 p-4 bg-slate-900/50 border border-slate-800/50 rounded-xl items-center hover:border-blue-500/30 transition-all">
                        <div className="col-span-1 text-[11px] font-bold text-white">{spec.parameter}</div>
                        <div className="text-[10px] font-bold text-slate-500">{spec.unit}</div>
                        <div className="text-[10px] font-bold text-slate-400">{spec.specification}</div>
                        <div className="text-[11px] font-black text-emerald-500 text-right">{spec.actualResult}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No detailed specifications found for this batch</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-800">
            <div className="space-y-2">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Manufacturer</p>
              <p className="text-sm font-bold text-white">{coa.manufacturer}</p>
              <p className="text-[10px] font-bold text-slate-500">{coa.labName || 'Internal Quality Control'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Grounding Score</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${coa.authenticityScore}%` }}></div>
                </div>
                <span className="text-xs font-black text-emerald-500">{coa.authenticityScore}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Re-test Date</p>
              <p className="text-sm font-bold text-white">{coa.expiryDate}</p>
              <p className="text-[10px] font-bold text-slate-500">Analysis Date: {coa.issueDate}</p>
            </div>
          </div>

          {coa.originalPdfUrl && (
            <div className="bg-blue-600/5 border border-blue-500/20 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                  <Info className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Original Manufacturer Document Available</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verified External Resource</p>
                </div>
              </div>
              <a 
                href={coa.originalPdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all flex items-center gap-3"
              >
                <ExternalLink className="w-4 h-4" /> Open Original PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default COAModal;
