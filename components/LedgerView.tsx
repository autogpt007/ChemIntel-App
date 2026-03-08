
import React from 'react';
import { MarketEntity } from '../types';
import { Database, Search, User, MapPin, Phone, Mail, Globe, ArrowRight } from 'lucide-react';

interface LedgerViewProps {
  ledgerData: MarketEntity[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedRegion: string;
  setSelectedEntity: (entity: MarketEntity) => void;
}

const LedgerView: React.FC<LedgerViewProps> = ({
  ledgerData,
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedEntity
}) => {
  const filteredLedger = ledgerData.filter(l => 
    (selectedRegion === 'Global' || l.region === selectedRegion) &&
    ((l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) || 
     (l.chemicalFocus?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="bg-[#0c1220] border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-4xl font-black text-white tracking-tighter">Market Ledger</h3>
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mt-2">Verified Neural Leads & Entity Dossiers</p>
          </div>
          <div className="bg-[#050811] border border-slate-800 rounded-2xl flex items-center px-6 py-3 w-96">
            <Search className="w-5 h-5 text-slate-700 mr-4" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search Ledger..." 
              className="bg-transparent text-sm font-bold text-white outline-none w-full" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLedger.map((entity) => (
            <div 
              key={entity.id} 
              onClick={() => setSelectedEntity(entity)}
              className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] group hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${entity.type === 'Buyer' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'}`}>
                  {entity.type === 'Buyer' ? <Database className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${entity.type === 'Buyer' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'}`}>
                  {entity.type}
                </span>
              </div>
              <h4 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors mb-2">{entity.name}</h4>
              <div className="flex items-center gap-2 text-slate-500 mb-6">
                <MapPin className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase">{entity.country}</span>
              </div>
              <div className="space-y-3 pt-6 border-t border-slate-800/50">
                <div className="flex items-center gap-3 text-slate-400">
                  <User className="w-4 h-4" />
                  <span className="text-xs font-bold">{entity.contact.name}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-mono truncate">{entity.contact.email}</span>
                </div>
              </div>
              <div className="mt-8 flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Focus: {entity.chemicalFocus}</span>
                <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LedgerView;
