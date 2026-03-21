
import React, { useState } from 'react';
import { 
  Cpu, Activity, Zap, Shield, Globe, Truck, 
  Search, TrendingUp, Settings, Terminal, 
  BarChart3, Network, Server, Database, 
  AlertCircle, CheckCircle2, RefreshCcw,
  Sliders, Play, Pause, Trash2, Plus, Filter
} from 'lucide-react';
import { AgentStats } from '../types';

const NeuralCouncilAdmin: React.FC = () => {
  const [agents, setAgents] = useState<AgentStats[]>([
    { id: 'arch', name: 'The Architect', role: 'Orchestrator', status: 'Active', tasksCompleted: 1240, accuracy: 99.8, neuralLoad: 42, uptime: '14d 2h' },
    { id: 'recon', name: 'Recon-01', role: 'Market Intel', status: 'Active', tasksCompleted: 8500, accuracy: 97.5, neuralLoad: 68, uptime: '14d 2h' },
    { id: 'comp', name: 'Compliance Officer', role: 'Regulatory', status: 'Idle', tasksCompleted: 3200, accuracy: 100, neuralLoad: 12, uptime: '14d 2h' },
    { id: 'logi', name: 'Logistics Strategist', role: 'Supply Chain', status: 'Active', tasksCompleted: 2100, accuracy: 96.2, neuralLoad: 55, uptime: '14d 2h' },
    { id: 'lead', name: 'Lead Hunter', role: 'Buyer Acquisition', status: 'Active', tasksCompleted: 450, accuracy: 94.8, neuralLoad: 30, uptime: '14d 2h' },
    { id: 'strat', name: 'Quarterly Strategist', role: 'Product Optimization', status: 'Idle', tasksCompleted: 88, accuracy: 98.1, neuralLoad: 5, uptime: '14d 2h' },
    { id: 'fore', name: 'Quantum Forecaster', role: 'Predictive Analytics', status: 'Thinking', tasksCompleted: 156, accuracy: 98.4, neuralLoad: 89, uptime: '14d 2h' },
  ]);

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="bg-[#0c1220] border border-slate-800 p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 hidden lg:block">
          <Server className="w-64 h-64 text-blue-500" />
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end relative z-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Neural Council Management</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter">Council Admin Dashboard</h2>
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mt-2">Orchestrating Autonomous Agentic Intelligence</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none bg-slate-900 border border-slate-800 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <RefreshCcw className="w-4 h-4" /> Reboot Council
            </button>
            <button className="flex-1 lg:flex-none bg-blue-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20">
              <Plus className="w-4 h-4" /> Add Agent Node
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Total Neural Load', value: '48%', icon: Activity, color: 'text-blue-500' },
          { label: 'Active Nodes', value: '7/7', icon: Cpu, color: 'text-emerald-500' },
          { label: 'Daily Tasks', value: '12.4k', icon: Zap, color: 'text-yellow-500' },
          { label: 'Avg Accuracy', value: '98.2%', icon: CheckCircle2, color: 'text-indigo-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-800 rounded-lg lg:rounded-xl flex items-center justify-center">
                <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${stat.color}`} />
              </div>
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest hidden sm:block">Real-time</span>
            </div>
            <div>
              <p className="text-xl lg:text-3xl font-black text-white">{stat.value}</p>
              <p className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Table */}
      <div className="bg-[#0c1220] border border-slate-800 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-6 lg:p-8 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xs lg:text-sm font-black text-white uppercase tracking-widest">Agent Node Registry</h3>
          <div className="flex gap-2">
            <button className="p-2 text-slate-500 hover:text-white transition-colors"><Filter className="w-4 h-4" /></button>
            <button className="p-2 text-slate-500 hover:text-white transition-colors"><Search className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="px-6 lg:px-8 py-4 lg:py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Agent Node</th>
                <th className="px-6 lg:px-8 py-4 lg:py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 lg:px-8 py-4 lg:py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Tasks</th>
                <th className="px-6 lg:px-8 py-4 lg:py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Accuracy</th>
                <th className="px-6 lg:px-8 py-4 lg:py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Load</th>
                <th className="px-6 lg:px-8 py-4 lg:py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-slate-800/30 hover:bg-slate-900/20 transition-colors group">
                  <td className="px-6 lg:px-8 py-4 lg:py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-white/5">
                        <Cpu className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">{agent.name}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">ID: {agent.id.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        agent.status === 'Active' ? 'bg-emerald-500 animate-pulse' :
                        agent.status === 'Thinking' ? 'bg-blue-500 animate-pulse' :
                        agent.status === 'Idle' ? 'bg-slate-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-[10px] font-black text-slate-300 uppercase">{agent.status}</span>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6 text-center">
                    <span className="text-xs font-mono text-slate-400">{agent.tasksCompleted.toLocaleString()}</span>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6 text-center">
                    <span className={`text-xs font-black ${agent.accuracy > 98 ? 'text-emerald-500' : 'text-blue-500'}`}>
                      {agent.accuracy}%
                    </span>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6">
                    <div className="w-32 space-y-2">
                      <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase">
                        <span>Load</span>
                        <span>{agent.neuralLoad}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${agent.neuralLoad > 80 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${agent.neuralLoad}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"><Sliders className="w-4 h-4" /></button>
                      <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-blue-500 transition-all">
                        {agent.status === 'Idle' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </button>
                      <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Neural Blackboard / Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-[#0c1220] border border-slate-800 p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-2xl">
          <h3 className="text-[10px] lg:text-xs font-black text-white uppercase tracking-[0.3em] mb-6 lg:mb-8 flex items-center gap-3">
            <Terminal className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" /> Neural Blackboard
          </h3>
          <div className="space-y-4 font-mono text-[9px] lg:text-[10px]">
            {[
              { time: '16:43:01', agent: 'ARCH', msg: 'Orchestrating cross-agent sync for Q3 forecast request.' },
              { time: '16:43:05', agent: 'FORE', msg: 'Quantum model converged. Accuracy: 98.42%. Production advice generated.' },
              { time: '16:43:10', agent: 'LEAD', msg: 'Scraping Panjiva for Methanol buyers in APAC. 12 high-intent leads found.' },
              { time: '16:43:15', agent: 'COMP', msg: 'Regulatory check complete for APAC leads. All compliant with local GHS.' },
            ].map((log, i) => (
              <div key={i} className="flex gap-3 lg:gap-4 p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                <span className="text-slate-600">[{log.time}]</span>
                <span className="text-blue-500 font-black">[{log.agent}]</span>
                <span className="text-slate-400">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0c1220] border border-slate-800 p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-2xl">
          <h3 className="text-[10px] lg:text-xs font-black text-white uppercase tracking-[0.3em] mb-6 lg:mb-8 flex items-center gap-3">
            <Network className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-500" /> Inter-Agent Connectivity
          </h3>
          <div className="h-40 lg:h-48 flex items-center justify-center border border-slate-800 rounded-2xl bg-slate-950/50 relative overflow-hidden">
             <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 lg:w-64 h-48 lg:h-64 border border-blue-500 rounded-full animate-ping"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 lg:w-32 h-24 lg:h-32 border border-indigo-500 rounded-full animate-pulse"></div>
             </div>
             <div className="relative z-10 text-center px-4">
                <p className="text-[10px] lg:text-xs font-black text-white uppercase tracking-widest mb-2">Neural Mesh Active</p>
                <p className="text-[8px] lg:text-[9px] font-bold text-slate-500 uppercase">7 Nodes Synchronized via Quantum Tunneling</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralCouncilAdmin;
