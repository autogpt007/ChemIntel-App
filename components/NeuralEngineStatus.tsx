
import React, { useEffect, useState } from 'react';
import { BrainCircuit, Activity, ShieldCheck } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const NeuralEngineStatus: React.FC = () => {
  const [status, setStatus] = useState<'Active' | 'Optimizing' | 'Standby'>('Active');
  const [load, setLoad] = useState(42);

  useEffect(() => {
    const fetchPulse = async () => {
      const pulse = await geminiService.getMarketPulse();
      if (pulse) {
        setLoad(pulse.neuralLoad);
        setStatus('Active');
      }
    };

    fetchPulse();
    const interval = setInterval(fetchPulse, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Engine</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-black text-emerald-500 uppercase">{status}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[8px] font-black text-slate-500 uppercase">Processing Load</span>
          <span className="text-[8px] font-mono font-bold text-blue-400">{load.toFixed(1)}%</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-1000" 
            style={{ width: `${load}%` }} 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
          <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Sentiment</p>
          <div className="flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-blue-400" />
            <span className="text-[9px] font-bold text-white">Adaptive</span>
          </div>
        </div>
        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
          <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Security</p>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
            <span className="text-[9px] font-bold text-white">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralEngineStatus;
