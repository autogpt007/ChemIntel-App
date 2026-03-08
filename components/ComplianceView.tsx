
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { ComplianceDossier } from '../types';
import { 
  ShieldCheck, FileText, AlertTriangle, CheckCircle2, 
  Clock, Globe, Search, Loader2, FileSearch, Scale,
  Info, ExternalLink, ShieldAlert
} from 'lucide-react';

const ComplianceView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [dossier, setDossier] = useState<ComplianceDossier | null>(null);

  const generateDossier = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const result = await geminiService.getRegulatoryDossier(query);
      setDossier(result);
    } catch (error) {
      console.error("Regulatory dossier generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="bg-[#0c1220] border border-slate-800 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="w-24 h-24 bg-emerald-600/10 rounded-full flex items-center justify-center shrink-0 ring-8 ring-emerald-600/5 shadow-2xl">
            <Scale className="w-10 h-10 text-emerald-500" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Neural Compliance Hub</h2>
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Global Regulatory Intelligence & Risk Assessment</p>
          </div>
        </div>

        <div className="max-w-4xl mt-12 flex flex-col md:flex-row gap-6 bg-[#050811] p-6 rounded-[2.5rem] border border-slate-800 shadow-3xl relative">
          <div className="flex-1 flex gap-4 px-4 items-center">
            <Search className="w-6 h-6 text-slate-700" />
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Enter chemical name for compliance scan..." 
              className="flex-1 bg-transparent text-xl text-white outline-none font-bold" 
            />
          </div>
          <button 
            onClick={generateDossier} 
            disabled={loading} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 flex items-center gap-3"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
            {loading ? 'SCANNING...' : 'GENERATE DOSSIER'}
          </button>
        </div>
      </div>

      {dossier && (
        <div className="grid grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Dossier</p>
                <span className="text-[10px] font-bold text-slate-600 uppercase">Updated: {dossier.lastUpdated}</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-2">{dossier.assetName}</h3>
              <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-6">CAS: {dossier.casNumber}</p>
              <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                  "{dossier.summary}"
                </p>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] shadow-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Compliance Health</p>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Risk Level</span>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase rounded-lg">Low Impact</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Global Coverage</span>
                  <span className="text-xs font-black text-white">92% Verified</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Regulatory Requirements</p>
            <div className="grid grid-cols-1 gap-6">
              {dossier.requirements?.map((req) => (
                <div key={req.id} className="bg-[#0c1220] border border-slate-800 p-8 rounded-[2.5rem] hover:border-emerald-500/30 transition-all shadow-2xl group">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 border ${
                      req.status === 'Compliant' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                      req.status === 'Action Required' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                      'bg-orange-500/10 border-orange-500/20 text-orange-500'
                    }`}>
                      {req.status === 'Compliant' ? <CheckCircle2 className="w-10 h-10" /> : 
                       req.status === 'Action Required' ? <ShieldAlert className="w-10 h-10" /> : 
                       <Clock className="w-10 h-10" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-black text-white">{req.framework}</span>
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                            req.impact === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            req.impact === 'Medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          }`}>
                            {req.impact} Impact
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          {req.deadline && (
                            <div className="flex items-center gap-2 text-slate-500">
                              <Clock className="w-3 h-3" />
                              <span className="text-[10px] font-bold uppercase">{req.deadline}</span>
                            </div>
                          )}
                          <span className={`text-[10px] font-black uppercase tracking-widest ${
                            req.status === 'Compliant' ? 'text-emerald-500' :
                            req.status === 'Action Required' ? 'text-red-500' :
                            'text-orange-500'
                          }`}>{req.status}</span>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-slate-200 mb-2">{req.requirement}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed mb-6">{req.description}</p>
                      <div className="flex items-center gap-6 pt-6 border-t border-slate-800/50">
                        <button className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors">
                          <FileText className="w-3 h-3" /> View Full Specs
                        </button>
                        <button className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                          <Globe className="w-3 h-3" /> Official Source <ExternalLink className="w-2 h-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceView;
