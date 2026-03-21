
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
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="bg-white border border-slate-200 p-8 lg:p-12 rounded-[2rem] lg:rounded-[4rem] shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-center">
          <div className="w-16 h-16 lg:w-24 lg:h-24 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 ring-4 lg:ring-8 ring-emerald-50 shadow-sm">
            <Scale className="w-8 h-8 lg:w-10 lg:h-10 text-emerald-600" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-2">Neural Compliance Hub</h2>
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[8px] lg:text-[10px]">Global Regulatory Intelligence & Risk Assessment</p>
          </div>
        </div>

        <div className="max-w-4xl mt-8 lg:mt-12 flex flex-col md:flex-row gap-4 lg:gap-6 bg-slate-50 p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-200 shadow-sm relative">
          <div className="flex-1 flex gap-4 px-2 lg:px-4 items-center">
            <Search className="w-5 h-5 lg:w-6 lg:h-6 text-slate-300" />
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Enter chemical name..." 
              className="flex-1 bg-transparent text-lg lg:text-xl text-slate-900 outline-none font-bold placeholder:text-slate-300" 
            />
          </div>
          <button 
            onClick={generateDossier} 
            disabled={loading} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 lg:px-12 py-4 lg:py-5 rounded-[1.2rem] lg:rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[10px] lg:text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
            {loading ? 'SCANNING...' : 'GENERATE DOSSIER'}
          </button>
        </div>
      </div>

      {dossier && (
        <div className="grid grid-cols-12 gap-6 lg:gap-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="col-span-12 lg:col-span-4 space-y-6 lg:space-y-8">
            <div className="bg-white border border-slate-200 p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-sm">
              <div className="flex justify-between items-center mb-6 lg:mb-8">
                <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Dossier</p>
                <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase">Updated: {dossier.lastUpdated}</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2">{dossier.assetName}</h3>
              <p className="text-[10px] lg:text-sm font-bold text-emerald-600 uppercase tracking-widest mb-6">CAS: {dossier.casNumber}</p>
              <div className="p-5 lg:p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] lg:text-xs font-bold text-slate-500 leading-relaxed italic">
                  "{dossier.summary}"
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-sm">
              <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 lg:mb-8">Compliance Health</p>
              <div className="space-y-4 lg:space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase">Risk Level</span>
                  <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] lg:text-[10px] font-black uppercase rounded-lg">Low Impact</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase">Global Coverage</span>
                  <span className="text-[10px] lg:text-xs font-black text-slate-900">92% Verified</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-6">
            <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Regulatory Requirements</p>
            <div className="grid grid-cols-1 gap-4 lg:gap-6">
              {dossier.requirements?.map((req) => (
                <div key={req.id} className="bg-white border border-slate-200 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] hover:border-emerald-500/30 transition-all shadow-sm group card-hover">
                  <div className="flex flex-col sm:flex-row gap-6 lg:gap-8">
                    <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl flex items-center justify-center shrink-0 border ${
                      req.status === 'Compliant' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                      req.status === 'Action Required' ? 'bg-red-50 border-red-100 text-red-500' :
                      'bg-orange-50 border-orange-100 text-orange-600'
                    }`}>
                      {req.status === 'Compliant' ? <CheckCircle2 className="w-8 h-8 lg:w-10 lg:h-10" /> : 
                       req.status === 'Action Required' ? <ShieldAlert className="w-8 h-8 lg:w-10 lg:h-10" /> : 
                       <Clock className="w-8 h-8 lg:w-10 lg:h-10" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-xl lg:text-2xl font-black text-slate-900">{req.framework}</span>
                          <span className={`px-2.5 py-1 rounded-lg text-[8px] lg:text-[9px] font-black uppercase tracking-widest border ${
                            req.impact === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                            req.impact === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                            'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {req.impact} Impact
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          {req.deadline && (
                            <div className="flex items-center gap-2 text-slate-400">
                              <Clock className="w-3 h-3" />
                              <span className="text-[9px] lg:text-[10px] font-bold uppercase">{req.deadline}</span>
                            </div>
                          )}
                          <span className={`text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${
                            req.status === 'Compliant' ? 'text-emerald-600' :
                            req.status === 'Action Required' ? 'text-red-500' :
                            'text-orange-600'
                          }`}>{req.status}</span>
                        </div>
                      </div>
                      <h4 className="text-lg lg:text-xl font-bold text-slate-700 mb-2">{req.requirement}</h4>
                      <p className="text-[13px] lg:text-sm text-slate-500 leading-relaxed mb-6">{req.description}</p>
                      <div className="flex flex-wrap items-center gap-4 lg:gap-6 pt-6 border-t border-slate-100">
                        <button className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors">
                          <FileText className="w-3 h-3" /> View Full Specs
                        </button>
                        <button className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
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
