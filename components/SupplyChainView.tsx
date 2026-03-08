
import React from 'react';
import { SupplyChainData, HubIntel } from '../types';
import { Network, Loader2, Radar, ShieldAlert, Workflow } from 'lucide-react';
import SupplyChainMap from './SupplyChainMap';

interface SupplyChainViewProps {
  supplyChainData: SupplyChainData | null;
  loading: boolean;
  probeStatus: string[];
  hubIntel: HubIntel | null;
  searchQuery: string;
  setActiveTab: (tab: string) => void;
}

const SupplyChainView: React.FC<SupplyChainViewProps> = ({
  supplyChainData,
  loading,
  probeStatus,
  hubIntel,
  searchQuery,
  setActiveTab
}) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="bg-[#0c1220] border border-slate-800 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center shrink-0 ring-8 ring-indigo-600/5 shadow-2xl">
            <Network className="w-10 h-10 text-indigo-500" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Supply Chain Topology</h2>
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Neural Mapping of Global Logistics & Risk Nodes</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 bg-slate-900/20 rounded-[4rem] border border-dashed border-slate-800">
          <Loader2 className="w-20 h-20 text-indigo-500 animate-spin mb-8" />
          <p className="text-2xl font-black text-slate-700 uppercase tracking-widest">Mapping Global Nodes...</p>
          <p className="text-sm font-bold text-indigo-400 uppercase mt-4 animate-pulse">{probeStatus[0] || 'Tracing logistics corridors...'}</p>
        </div>
      ) : supplyChainData ? (
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-[#0c1220] border border-slate-800 rounded-[4rem] p-10 shadow-3xl h-[700px] relative overflow-hidden">
               <SupplyChainMap data={supplyChainData} assetName={hubIntel?.assetName || searchQuery || 'Unknown Asset'} />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3 space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3"><ShieldAlert className="w-5 h-5 text-red-500" /> Critical Risks</h3>
              <div className="space-y-4">
                {supplyChainData.links?.filter(l => l.riskLevel === 'High').map((link, i) => (
                  <div key={i} className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
                    <p className="text-[10px] font-black text-red-500 uppercase mb-1">High Risk Corridor</p>
                    <p className="text-xs font-bold text-white">{link.source} → {link.target}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3"><Workflow className="w-5 h-5 text-blue-500" /> Node Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                  <span className="text-slate-500">Stable</span>
                  <span className="text-emerald-500">{supplyChainData.nodes?.filter(n => n.status === 'Stable').length || 0}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                  <span className="text-slate-500">At Risk</span>
                  <span className="text-orange-500">{supplyChainData.nodes?.filter(n => n.status === 'At Risk').length || 0}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                  <span className="text-slate-500">Disrupted</span>
                  <span className="text-red-500">{supplyChainData.nodes?.filter(n => n.status === 'Disrupted').length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 bg-slate-900/20 rounded-[4rem] border border-dashed border-slate-800">
          <Radar className="w-24 h-24 text-slate-800 mb-8 animate-pulse" />
          <p className="text-2xl font-black text-slate-700 uppercase tracking-widest">Topology Data Pending</p>
          <p className="text-xs font-bold text-slate-500 uppercase mt-4">Run a Live Recon to populate supply chain mapping.</p>
        </div>
      )}
    </div>
  );
};

export default SupplyChainView;
