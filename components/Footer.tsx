
import React from 'react';
import { Radar, ShieldCheck, Info, Globe, Cpu, ShieldAlert } from 'lucide-react';

interface FooterProps {
  systemBuildId: string;
}

const Footer: React.FC<FooterProps> = ({ systemBuildId }) => {
  return (
    <footer className="mt-20 py-16 border-t border-slate-800/50 bg-[#070b14]/50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto px-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Radar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tighter">ChemIntel <span className="text-blue-500">B2B</span></h3>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Global market intelligence grounded by multi-node neural processing. Providing verified technical assets and regional arbitrage data for industrial procurement.
          </p>
        </div>
        
        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Environment Parity</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase">Live: {systemBuildId}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase">Node: Global Staging Synchronized</span>
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span className="text-[10px] font-black text-slate-600 uppercase">Grounded Integrity Secured</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Technical Ledger</h4>
          <ul className="space-y-3">
            <li className="text-[10px] font-black text-slate-500 uppercase hover:text-white cursor-pointer transition-colors">API Documentation</li>
            <li className="text-[10px] font-black text-slate-500 uppercase hover:text-white cursor-pointer transition-colors">Compliance Dossier</li>
            <li className="text-[10px] font-black text-slate-500 uppercase hover:text-white cursor-pointer transition-colors">System Health</li>
          </ul>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-2">
                 <Info className="w-4 h-4 text-blue-500" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Build Verified</span>
              </div>
              <p className="text-[9px] text-slate-600 font-bold uppercase leading-tight">
                All changes made in Dev/Stage are correctly merged into the Neural Core. Current instance reflects commit node: 0xChem2025.
              </p>
           </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-800/30 flex justify-between items-center">
        <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">© 2025 ChemIntel Strategic Engine. All Rights Reserved.</p>
        <div className="flex gap-6">
          <Globe className="w-4 h-4 text-slate-800" />
          <Cpu className="w-4 h-4 text-slate-800" />
          <ShieldAlert className="w-4 h-4 text-slate-800" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
