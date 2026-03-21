
import React, { useState, useEffect } from 'react';
import { 
  Settings, Shield, Zap, Activity, Database, Users, 
  Terminal, Cpu, Globe, Lock, AlertTriangle, CheckCircle2,
  RefreshCcw, BarChart3, Sliders, Eye, Trash2, Power, Lightbulb
} from 'lucide-react';
import { SystemConfig, IntegrationNode, NeuralProcessLog } from '../types';

interface AdminControlCenterProps {
  config: SystemConfig;
  setConfig: (config: SystemConfig) => void;
  logs: NeuralProcessLog[];
  onClearLogs: () => void;
}

const AdminControlCenter: React.FC<AdminControlCenterProps> = ({
  config,
  setConfig,
  logs,
  onClearLogs
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'ai' | 'nodes' | 'logs'>('overview');
  const [isSyncing, setIsSyncing] = useState(false);

  const toggleNode = (id: string) => {
    const updatedNodes = config.integrationNodes.map(node => 
      node.id === id ? { ...node, status: node.status === 'Operational' ? 'Offline' : 'Operational' } : node
    );
    setConfig({ ...config, integrationNodes: updatedNodes as IntegrationNode[] });
  };

  const updateConfig = (key: keyof SystemConfig, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      {/* Admin Header */}
      <div className="bg-white border border-slate-200 p-12 rounded-[4rem] shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center shrink-0 ring-8 ring-slate-100 shadow-xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Neural Control Center</h2>
              <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">System Governance & AI Orchestration</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => { setIsSyncing(true); setTimeout(() => setIsSyncing(false), 2000); }}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
            >
              <RefreshCcw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> Full System Sync
            </button>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="flex gap-8 mt-16 border-t border-slate-100 pt-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'ai', label: 'AI Engine', icon: Cpu },
            { id: 'nodes', label: 'Node Network', icon: Globe },
            { id: 'logs', label: 'Audit Logs', icon: Terminal },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSubTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-8 space-y-10">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8">
              {[
                { label: 'Total Neural Probes', value: '14,202', trend: '+12%', icon: Activity, color: 'text-blue-600' },
                { label: 'API Quota Used', value: '42.8%', trend: 'Stable', icon: Database, color: 'text-emerald-600' },
                { label: 'Active Sessions', value: '184', trend: '+4', icon: Users, color: 'text-indigo-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-500">{stat.trend}</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* System Health */}
            <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-10 flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-600" /> Real-time System Health
              </h3>
              <div className="space-y-8">
                {config.integrationNodes.map((node) => (
                  <div key={node.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-6">
                      <div className={`w-3 h-3 rounded-full ${node.status === 'Operational' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{node.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{node.type} • {node.tier}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Latency</p>
                        <p className="text-xs font-bold text-slate-900">{node.status === 'Operational' ? '42ms' : 'N/A'}</p>
                      </div>
                      <button 
                        onClick={() => toggleNode(node.id)}
                        className={`p-3 rounded-xl transition-all ${
                          node.status === 'Operational' 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        <Power className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-10">
            {/* Security Status */}
            <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-10 flex items-center gap-3">
                <Lock className="w-5 h-5 text-indigo-600" /> Security Perimeter
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Firewall Status</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-lg">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Encryption</span>
                  <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-lg">AES-256</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Threat Level</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-lg">Low</span>
                </div>
              </div>
              <button className="w-full mt-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">
                Run Security Audit
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white">
              <h3 className="text-xs font-black uppercase tracking-widest mb-10 flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-400" /> Emergency Protocols
              </h3>
              <div className="space-y-4">
                <button className="w-full py-4 bg-red-600/20 border border-red-600/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-600/30 transition-all flex items-center justify-center gap-3">
                  <AlertTriangle className="w-4 h-4" /> Flush Neural Cache
                </button>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all">
                  Rotate API Gateways
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'ai' && (
        <div className="bg-white border border-slate-200 p-12 rounded-[4rem] shadow-sm max-w-5xl mx-auto">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-12 flex items-center gap-4">
            <Cpu className="w-8 h-8 text-blue-600" /> AI Engine Configuration
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Neural Engine</label>
                <select 
                  value={config.aiModel}
                  onChange={(e) => updateConfig('aiModel', e.target.value)}
                  className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-500 transition-all"
                >
                  <option value="gemini-3-flash-preview">Gemini 3 Flash (High Speed)</option>
                  <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Deep Reasoning)</option>
                  <option value="google/gemini-2.0-pro-exp-02-05:free">Gemini 2.0 Pro Exp (Experimental)</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thinking Budget (Tokens)</label>
                  <span className="text-xs font-black text-blue-600">{config.thinkingBudget.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="4000" 
                  max="64000" 
                  step="4000"
                  value={config.thinkingBudget}
                  onChange={(e) => updateConfig('thinkingBudget', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scraping Depth</label>
                  <span className="text-xs font-black text-blue-600">{config.scrapingDepth} Nodes</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={config.scrapingDepth}
                  onChange={(e) => updateConfig('scrapingDepth', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            <div className="space-y-10">
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-900">Auto-Seeding</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Generate synthetic nodes when data is sparse</p>
                  </div>
                  <button 
                    onClick={() => updateConfig('autoSeeding', !config.autoSeeding)}
                    className={`w-14 h-8 rounded-full transition-all relative ${config.autoSeeding ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${config.autoSeeding ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-900">Cache Persistence</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Store neural results for 24h</p>
                  </div>
                  <button 
                    onClick={() => updateConfig('cachePersistence', !config.cachePersistence)}
                    className={`w-14 h-8 rounded-full transition-all relative ${config.cachePersistence ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${config.cachePersistence ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>

              <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
                <div className="flex gap-4 items-start">
                  <Lightbulb className="w-6 h-6 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-xs font-black text-blue-900 uppercase tracking-widest mb-2">Admin Tip</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Increasing the thinking budget improves reasoning for complex arbitrage calculations but may increase latency by up to 400ms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'nodes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {config.integrationNodes.map((node) => (
            <div key={node.id} className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm group hover:border-blue-200 transition-all">
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl ${node.status === 'Operational' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  <Globe className="w-8 h-8" />
                </div>
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  node.status === 'Operational' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {node.status}
                </span>
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">{node.name}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">{node.type} • {node.tier}</p>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-slate-400">Last Sync</span>
                  <span className="text-slate-900">{node.lastSync}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-slate-400">Uptime</span>
                  <span className="text-slate-900">99.98%</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">
                  Configure
                </button>
                <button className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-all">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button className="bg-slate-50 border border-dashed border-slate-300 p-10 rounded-[3rem] flex flex-col items-center justify-center gap-4 hover:bg-slate-100 transition-all group">
            <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-all">
              <RefreshCcw className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Integration Node</p>
          </button>
        </div>
      )}

      {activeSubTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-[4rem] shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <Terminal className="w-5 h-5 text-blue-600" /> Neural Audit Ledger
            </h3>
            <button 
              onClick={onClearLogs}
              className="px-6 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-100 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Clear Ledger
            </button>
          </div>
          <div className="p-10 max-h-[600px] overflow-y-auto font-mono">
            <div className="space-y-4">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-6 p-4 hover:bg-slate-50 rounded-xl transition-all group">
                  <span className="text-[10px] text-slate-400 shrink-0">[{log.timestamp}]</span>
                  <span className={`text-[10px] font-black uppercase shrink-0 w-20 ${
                    log.level === 'SUCCESS' ? 'text-emerald-600' : 
                    log.level === 'WARNING' ? 'text-orange-600' : 
                    log.level === 'ERROR' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {log.level}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{log.message}</p>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="py-20 text-center text-slate-300 italic">
                  No audit logs recorded in current session.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminControlCenter;
