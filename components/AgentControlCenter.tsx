
import React, { useState, useEffect } from 'react';
import { 
  Cpu, Activity, Shield, Zap, Globe, Truck, 
  Terminal, Settings, Play, Square, RefreshCw,
  BarChart3, Network, Database, BrainCircuit,
  AlertTriangle, CheckCircle2, Clock, Sparkles,
  TrendingDown, DollarSign
} from 'lucide-react';
import { AgentStats, AgentTask } from '../types';
import { useAgentData } from '../App';

const AgentControlCenter: React.FC = () => {
  const { agents, tasks, skynetStatus, costStats } = useAgentData();
  const [systemLoad, setSystemLoad] = useState(34);

  useEffect(() => {
    const avgLoad = agents.reduce((acc, a) => acc + a.neuralLoad, 0) / agents.length;
    setSystemLoad(Math.round(avgLoad));
  }, [agents]);

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      {/* Skynet Pulse & Global Status */}
      <div className="bg-[#0c1220] border border-slate-800 p-10 rounded-[3rem] shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <BrainCircuit className="w-64 h-64 text-blue-500 animate-pulse" />
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${
                skynetStatus === 'Active' ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)]' : 
                skynetStatus === 'Waking' ? 'border-yellow-500 animate-pulse' : 'border-slate-800'
              }`}>
                <Cpu className={`w-10 h-10 ${skynetStatus === 'Active' ? 'text-blue-400' : 'text-slate-600'}`} />
              </div>
              {skynetStatus === 'Active' && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#0c1220] animate-bounce"></div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                  skynetStatus === 'Active' ? 'text-blue-500' : 'text-slate-500'
                }`}>Neural Core Status</span>
                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                  skynetStatus === 'Active' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-slate-800 text-slate-500'
                }`}>{skynetStatus}</div>
              </div>
              <h2 className="text-5xl font-black text-white tracking-tighter">Skynet Neural Mesh</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Autonomous Agentic Intelligence Layer Live</p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="bg-[#050811] border border-slate-800 p-6 rounded-3xl text-center min-w-[160px]">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Efficiency</p>
              <p className="text-3xl font-black text-emerald-500">{costStats.efficiency}</p>
              <div className="flex items-center justify-center gap-1 mt-1 text-[8px] font-bold text-slate-500 uppercase">
                <TrendingDown className="w-3 h-3" /> Optimized
              </div>
            </div>
            <div className="bg-[#050811] border border-slate-800 p-6 rounded-3xl text-center min-w-[160px]">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Neural Savings</p>
              <p className="text-3xl font-black text-blue-500">${costStats.totalSavings}</p>
              <div className="flex items-center justify-center gap-1 mt-1 text-[8px] font-bold text-slate-500 uppercase">
                <DollarSign className="w-3 h-3" /> USD Simulated
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <div className="bg-[#0c1220] border border-slate-800 p-8 rounded-[2.5rem] shadow-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Network className="w-16 h-16 text-blue-500" />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Neural Load</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-black text-white">{systemLoad}%</h3>
            <span className="text-xs font-bold text-emerald-500 mb-1">Optimal</span>
          </div>
          <div className="mt-6 w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${systemLoad}%` }}></div>
          </div>
        </div>

        <div className="bg-[#0c1220] border border-slate-800 p-8 rounded-[2.5rem] shadow-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-16 h-16 text-indigo-500" />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Agents</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-black text-white">{agents.filter(a => a.status === 'Active' || a.status === 'Thinking').length}</h3>
            <span className="text-xs font-bold text-slate-400 mb-1">/ {agents.length}</span>
          </div>
          <p className="mt-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Orchestration Layer Synced</p>
        </div>

        <div className="bg-[#0c1220] border border-slate-800 p-8 rounded-[2.5rem] shadow-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Zap className="w-16 h-16 text-yellow-500" />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tasks Executed</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-black text-white">{(agents.reduce((acc, a) => acc + a.tasksCompleted, 0) / 1000).toFixed(1)}k</h3>
            <span className="text-xs font-bold text-emerald-500 mb-1">+12%</span>
          </div>
          <p className="mt-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Real-time Sync</p>
        </div>

        <div className="bg-[#0c1220] border border-slate-800 p-8 rounded-[2.5rem] shadow-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Shield className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Consensus Accuracy</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-black text-white">
              {(agents.reduce((acc, a) => acc + a.accuracy, 0) / agents.length).toFixed(1)}%
            </h3>
            <span className="text-xs font-bold text-emerald-500 mb-1">Stable</span>
          </div>
          <p className="mt-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Zero Hallucination Protocol</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 lg:gap-12">
        {/* Agent Management */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-[#0c1220] border border-slate-800 rounded-[3rem] p-10 shadow-3xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-4">
                <Cpu className="w-8 h-8 text-blue-500" /> Agent Fleet Management
              </h3>
              <button className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-[#050811] border border-slate-800 rounded-[2rem] p-8 group hover:border-blue-500/30 transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 ${
                        agent.status === 'Active' ? 'bg-blue-600/10 text-blue-500' : 'bg-slate-800/50 text-slate-600'
                      }`}>
                        {agent.id === 'arch' ? <BrainCircuit className="w-8 h-8" /> : 
                         agent.id === 'recon' ? <Globe className="w-8 h-8" /> :
                         agent.id === 'doc' ? <Database className="w-8 h-8" /> :
                         agent.id === 'comp' ? <Shield className="w-8 h-8" /> :
                         <Truck className="w-8 h-8" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-xl font-black text-white">{agent.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                            agent.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}>
                            {agent.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{agent.role}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 md:flex-none">
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Neural Load</p>
                        <p className="text-sm font-black text-white">{agent.neuralLoad}%</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Accuracy</p>
                        <p className="text-sm font-black text-emerald-500">{agent.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Tasks</p>
                        <p className="text-sm font-black text-blue-500">{agent.tasksCompleted}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button className={`p-3 rounded-xl transition-all ${
                          agent.status === 'Active' ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}>
                          {agent.status === 'Active' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5" />
                      Last Task: <span className="text-blue-500">{agent.lastTask}</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                      Uptime: {agent.uptime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Task Stream */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-[#0c1220] border border-slate-800 rounded-[3rem] p-10 shadow-3xl h-full">
            <h3 className="text-xl font-black text-white tracking-tighter flex items-center gap-4 mb-10">
              <Terminal className="w-6 h-6 text-emerald-500" /> Neural Task Stream
            </h3>
            
            <div className="space-y-6">
              {tasks.map((task) => (
                <div key={task.id} className="relative pl-8 border-l border-slate-800 pb-8 last:pb-0">
                  <div className={`absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full ${
                    task.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                    task.status === 'Running' ? 'bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                    'bg-slate-700'
                  }`}></div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      task.type === 'Market' ? 'text-emerald-500' :
                      task.type === 'Document' ? 'text-blue-500' :
                      'text-indigo-500'
                    }`}>{task.type} Task</span>
                    <span className="text-[9px] font-bold text-slate-600">{task.timestamp}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-300 leading-relaxed mb-3">{task.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-slate-500 uppercase">Agent:</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">
                      {agents.find(a => a.id === task.agentId)?.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-blue-600/5 border border-blue-500/10 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-4 h-4 text-blue-500" />
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">System Optimization</p>
              </div>
              <p className="text-[11px] font-bold text-slate-400 leading-relaxed">
                Logistics Architect is currently in idle state. Re-allocating neural budget to Recon-01 for high-priority market scouting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentControlCenter;
