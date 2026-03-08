
import React, { useState } from 'react';
import { RFQ, Vendor, RFQItem } from '../types';
import { FileText, Send, Clock, CheckCircle2, XCircle, ChevronRight, Plus, Trash2, Mail, Building2, Globe, FileEdit } from 'lucide-react';
import Markdown from 'react-markdown';

interface RFQEngineProps {
  rfqs: RFQ[];
  onUpdateRFQ: (rfq: RFQ) => void;
  onCreateRFQ: (rfq: RFQ) => void;
  onDeleteRFQ: (id: string) => void;
  onDraftRFQ?: (vendor: Vendor) => void;
}

const RFQEngine: React.FC<RFQEngineProps> = ({ rfqs, onUpdateRFQ, onCreateRFQ, onDeleteRFQ, onDraftRFQ }) => {
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const getStatusColor = (status: RFQ['status']) => {
    switch (status) {
      case 'Draft': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      case 'Sent': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Negotiating': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Accepted': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="bg-[#0c1220] border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h3 className="text-4xl font-black text-white tracking-tighter">Automated RFQ Engine</h3>
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mt-2">Neural Procurement & Vendor Negotiation</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-xl"
          >
            <Plus className="w-4 h-4" /> New RFQ Draft
          </button>
        </div>

        <div className="grid grid-cols-12 gap-10">
          {/* RFQ List */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Active Negotiations</p>
            {rfqs.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/20 rounded-[2.5rem] border border-dashed border-slate-800">
                <FileText className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                <p className="text-xs font-bold text-slate-600 uppercase">No active RFQs</p>
              </div>
            ) : (
              rfqs.map((rfq) => (
                <div 
                  key={rfq.id}
                  onClick={() => setSelectedRFQ(rfq)}
                  className={`p-6 rounded-[2rem] border transition-all cursor-pointer group ${
                    selectedRFQ?.id === rfq.id 
                      ? 'bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/5' 
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusColor(rfq.status)}`}>
                      {rfq.status}
                    </span>
                    <p className="text-[9px] font-black text-slate-600 uppercase">{rfq.createdAt}</p>
                  </div>
                  <h4 className={`text-lg font-black transition-colors ${selectedRFQ?.id === rfq.id ? 'text-blue-400' : 'text-white group-hover:text-blue-400'}`}>
                    {rfq.subject}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <Building2 className="w-3 h-3 text-slate-500" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{rfq.vendorName}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RFQ Detail / Editor */}
          <div className="col-span-12 lg:col-span-8">
            {selectedRFQ ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h2 className="text-3xl font-black text-white tracking-tighter">{selectedRFQ.subject}</h2>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(selectedRFQ.status)}`}>
                        {selectedRFQ.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">{selectedRFQ.vendorName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Last Updated: {selectedRFQ.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => onDeleteRFQ(selectedRFQ.id)}
                      className="p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {selectedRFQ.status === 'Draft' && (
                      <button 
                        onClick={() => onUpdateRFQ({...selectedRFQ, status: 'Sent'})}
                        className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl"
                      >
                        <Send className="w-4 h-4" /> Transmit RFQ
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800/50">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Items Requested</p>
                    <div className="space-y-4">
                      {selectedRFQ.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-black text-white">{item.assetName}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">{item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-blue-500 uppercase">{item.targetPrice || 'Market Rate'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800/50">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Negotiation Timeline</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <p className="text-[10px] font-bold text-slate-300 uppercase">RFQ Drafted - {selectedRFQ.createdAt}</p>
                      </div>
                      {selectedRFQ.status !== 'Draft' && (
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <p className="text-[10px] font-bold text-slate-300 uppercase">RFQ Transmitted - {selectedRFQ.lastUpdated}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Neural Draft Content</p>
                    <button className="flex items-center gap-2 text-[9px] font-black text-blue-500 uppercase hover:text-blue-400 transition-colors">
                      <FileEdit className="w-3 h-3" /> Edit Draft
                    </button>
                  </div>
                  <div className="bg-slate-950/80 p-10 rounded-[2.5rem] border border-slate-800/50 prose prose-invert max-w-none">
                    <div className="markdown-body">
                      <Markdown>{selectedRFQ.draftContent}</Markdown>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-40 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800">
                <Mail className="w-20 h-20 text-slate-800 mb-6" />
                <p className="text-xl font-black text-slate-700 uppercase tracking-widest">Select an RFQ to View Details</p>
                <p className="text-xs font-bold text-slate-500 uppercase mt-4">Manage your global procurement negotiations here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFQEngine;
