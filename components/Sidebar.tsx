
import React from 'react';
import { LayoutDashboard, TrendingUp, Search, FileText, Settings, ShieldCheck, Database, Radar, FileCheck, Globe, Network, Zap, MessageSquare, Newspaper } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Market Dashboard', icon: LayoutDashboard },
    { id: 'news', label: 'Live News Feed', icon: Newspaper },
    { id: 'geopolitical', label: 'Geopolitical', icon: Globe },
    { id: 'supplychain', label: 'Supply Chain', icon: Network },
    { id: 'arbitrage', label: 'Arbitrage Engine', icon: Zap },
    { id: 'sentiment', label: 'Sentiment Engine', icon: MessageSquare },
    { id: 'compliance', label: 'Compliance Hub', icon: ShieldCheck },
    { id: 'rfq', label: 'RFQ Engine', icon: FileText },
    { id: 'ledger', label: 'Market Ledger', icon: Database },
    { id: 'research', label: 'Intelligence Hub', icon: Search },
    { id: 'coa', label: 'COA Ledger', icon: FileCheck },
    { id: 'config', label: 'System Config', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-8 flex items-center gap-4">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          <Radar className="text-white w-6 h-6" />
        </div>
        <div>
           <h1 className="text-xl font-black tracking-tighter text-white">ChemIntel</h1>
           <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Neural B2B Engine</p>
        </div>
      </div>

      <nav className="flex-1 mt-8 px-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-2 pb-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/30 font-black'
                  : 'text-slate-500 hover:bg-slate-800 hover:text-white font-bold'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="px-4 py-3 bg-slate-950/50 rounded-2xl border border-slate-800/50">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Neural Recon Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
