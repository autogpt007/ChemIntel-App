
import React from 'react';
import { 
  LayoutDashboard, TrendingUp, Search, FileText, Settings, 
  ShieldCheck, Database, Radar, FileCheck, Globe, Network, 
  Zap, MessageSquare, Newspaper, Shield, BrainCircuit, Cpu, X 
} from 'lucide-react';

import { agentService } from '../services/agentService';

import NeuralEngineStatus from './NeuralEngineStatus';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const [skynetStatus, setSkynetStatus] = React.useState(agentService.getSkynetStatus());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSkynetStatus(agentService.getSkynetStatus());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const menuGroups = [
    {
      label: 'Intelligence',
      items: [
        { id: 'dashboard', label: 'Market Dashboard', icon: LayoutDashboard },
        { id: 'news', label: 'Live News Feed', icon: Newspaper },
        { id: 'geopolitical', label: 'Geopolitical', icon: Globe },
        { id: 'sentiment', label: 'Sentiment Engine', icon: MessageSquare },
        { id: 'research', label: 'Intelligence Hub', icon: Search },
      ]
    },
    {
      label: 'Operations',
      items: [
        { id: 'council', label: 'Neural Council', icon: BrainCircuit },
        { id: 'arbitrage', label: 'Arbitrage Engine', icon: Zap },
        { id: 'supplychain', label: 'Supply Chain', icon: Network },
        { id: 'rfq', label: 'RFQ Engine', icon: FileText },
      ]
    },
    {
      label: 'Data & Compliance',
      items: [
        { id: 'ledger', label: 'Market Ledger', icon: Database },
        { id: 'coa', label: 'COA Ledger', icon: FileCheck },
        { id: 'compliance', label: 'Compliance Hub', icon: ShieldCheck },
      ]
    },
    {
      label: 'System',
      items: [
        { id: 'agent-control', label: 'Agent Control', icon: Cpu },
        { id: 'config', label: 'System Config', icon: Settings },
        { id: 'admin', label: 'Admin Control', icon: Shield },
      ]
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex flex-col z-[70] transition-transform duration-300
        w-64 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
              <Radar className="text-white w-6 h-6" />
            </div>
            <div>
               <h1 className="text-xl font-black tracking-tighter text-slate-900">ChemIntel</h1>
               <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Neural B2B Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-900">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 mt-4 px-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-6 pb-8">
            {menuGroups.map((group) => (
              <div key={group.label}>
                <p className="px-5 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">{group.label}</p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-600 font-bold'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="text-[11px] uppercase tracking-wider">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-4">
          <NeuralEngineStatus />
          <div className="px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200/50">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Neural Pulse</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                skynetStatus === 'Active' ? 'bg-emerald-500 animate-pulse' : 
                skynetStatus === 'Waking' ? 'bg-yellow-500 animate-pulse' : 'bg-slate-300'
              }`}></div>
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">
                Skynet: {skynetStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
