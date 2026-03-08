
import React from 'react';
import { SystemConfig, NeuralProcessLog } from '../types';
import { 
  Settings, Cpu, Workflow, Database, Network, Server, 
  Sliders, Trash2, Plus, ShieldQuestion, ToggleRight, 
  ToggleLeft, X, ShieldAlert, Save, Radar, Globe
} from 'lucide-react';

interface ConfigViewProps {
  systemConfig: SystemConfig;
  setSystemConfig: (config: SystemConfig) => void;
  addLog: (msg: string, level: NeuralProcessLog['level']) => void;
  handleOpenNodeEditor: (node?: any) => void;
  handleDeleteIntegrationNode: (id: string) => void;
  isNodeModalOpen: boolean;
  setIsNodeModalOpen: (open: boolean) => void;
  editingNode: any;
  setEditingNode: (node: any) => void;
  handleSaveIntegrationNode: () => void;
}

const ConfigView: React.FC<ConfigViewProps> = ({
  systemConfig,
  setSystemConfig,
  addLog,
  handleOpenNodeEditor,
  handleDeleteIntegrationNode,
  isNodeModalOpen,
  setIsNodeModalOpen,
  editingNode,
  setEditingNode,
  handleSaveIntegrationNode
}) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
       <div className="bg-[#0c1220] border border-slate-800 p-12 rounded-[4rem] shadow-3xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-blue-600/10 rounded-[1.8rem] flex items-center justify-center border border-blue-500/20">
                <Settings className="w-10 h-10 text-blue-500" />
              </div>
              <div>
                <h2 className="text-5xl font-black text-white tracking-tighter">System Engine</h2>
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Neural Core Control & Integration Bridge</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => addLog("Neural Config Purge & Re-sync triggered.", "SUCCESS")} className="bg-slate-900 border border-slate-800 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all">Reset Default</button>
              <button onClick={() => addLog("Neural Config Purge & Re-sync triggered.", "SUCCESS")} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all">Save & Reboot Engine</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-10">
                <section>
                   <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3"><Cpu className="w-5 h-5 text-blue-500" /> Neural Parameters</h4>
                   <div className="space-y-8 bg-slate-900/40 p-10 rounded-[3rem] border border-slate-800 shadow-xl">
                      <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">Core Temperature</span>
                          <span className="text-blue-400">{systemConfig.temperature}</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.1" value={systemConfig.temperature} onChange={(e) => setSystemConfig({...systemConfig, temperature: parseFloat(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        <p className="text-[9px] text-slate-600 font-bold uppercase italic">Higher values increase creative signal discovery but risk logic hallucinations.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">Thinking Budget (Tokens)</span>
                          <span className="text-blue-400">{systemConfig.thinkingBudget}</span>
                        </div>
                        <input type="range" min="1000" max="32000" step="1000" value={systemConfig.thinkingBudget} onChange={(e) => setSystemConfig({...systemConfig, thinkingBudget: parseInt(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Active Neural Engine</label>
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                          <p className="text-xs font-black text-white">Hybrid: Gemini Direct + OpenRouter Fallback</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 italic">Uses Google AI Studio credits first, then switches to OpenRouter automatically.</p>
                        </div>
                      </div>
                   </div>
                </section>

                <section>
                   <div className="flex justify-between items-center mb-8">
                     <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3"><Workflow className="w-5 h-5 text-indigo-500" /> Integration Nodes</h4>
                     <button onClick={() => handleOpenNodeEditor()} className="flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600/20 transition-all">
                       <Plus className="w-3 h-3" /> New Pipeline
                     </button>
                   </div>
                   <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
                      {systemConfig.integrationNodes.map((node) => (
                        <div key={node.id} className="p-6 bg-slate-900/40 rounded-[2rem] border border-slate-800 flex justify-between items-center group hover:border-blue-500/30 transition-all shadow-md">
                          <div className="flex items-center gap-6">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${node.status === 'Operational' || node.status === 'Synchronized' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                               {node.type === 'Market' ? <Database className="w-6 h-6" /> : node.type === 'Grounding' ? <Network className="w-6 h-6" /> : <Server className="w-6 h-6" />}
                             </div>
                             <div>
                               <p className="text-sm font-black text-white">{node.name}</p>
                               <div className="flex gap-4 mt-1">
                                 <p className={`text-[9px] font-black uppercase ${node.status === 'Operational' || node.status === 'Synchronized' ? 'text-emerald-500' : 'text-red-500'}`}>{node.status}</p>
                                 <p className="text-[9px] font-black text-slate-600 uppercase">Tier: {node.tier}</p>
                                 <p className="text-[9px] font-black text-slate-700 uppercase">Last: {node.lastSync}</p>
                               </div>
                             </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenNodeEditor(node)} className="p-2 text-slate-600 hover:text-white transition-colors"><Sliders className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteIntegrationNode(node.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                      {systemConfig.integrationNodes.length === 0 && (
                        <div className="text-center py-20 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800">
                          <ShieldQuestion className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                          <p className="text-xs font-black text-slate-700 uppercase tracking-widest">No active integrations discovered.</p>
                        </div>
                      )}
                   </div>
                </section>
             </div>

             <div className="space-y-10">
                <section>
                   <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3"><Radar className="w-5 h-5 text-emerald-500" /> Market Probe Settings</h4>
                   <div className="space-y-6 bg-slate-900/40 p-10 rounded-[3rem] border border-slate-800 shadow-xl">
                      <div className="flex justify-between items-center p-4 bg-slate-950/50 rounded-2xl hover:bg-slate-950 transition-colors cursor-pointer" onClick={() => setSystemConfig({...systemConfig, autoSeeding: !systemConfig.autoSeeding})}>
                         <div>
                            <p className="text-xs font-black text-white">Auto-Seeding Neural Leads</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase">Proactively identifies buyers for new market signals.</p>
                         </div>
                         <button className={`p-1.5 rounded-full transition-all ${systemConfig.autoSeeding ? 'bg-emerald-600' : 'bg-slate-800'}`}>
                           {systemConfig.autoSeeding ? <ToggleRight className="w-8 h-8 text-white" /> : <ToggleLeft className="w-8 h-8 text-slate-500" />}
                         </button>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-slate-950/50 rounded-2xl hover:bg-slate-950 transition-colors cursor-pointer" onClick={() => setSystemConfig({...systemConfig, cachePersistence: !systemConfig.cachePersistence})}>
                         <div>
                            <p className="text-xs font-black text-white">Cache Intelligence Persistence</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase">Store grounding results for faster regional switches.</p>
                         </div>
                         <button className={`p-1.5 rounded-full transition-all ${systemConfig.cachePersistence ? 'bg-emerald-600' : 'bg-slate-800'}`}>
                           {systemConfig.cachePersistence ? <ToggleRight className="w-8 h-8 text-white" /> : <ToggleLeft className="w-8 h-8 text-slate-500" />}
                         </button>
                      </div>
                      <div className="space-y-4 pt-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">Deep Extraction Depth</span>
                          <span className="text-blue-400">{systemConfig.scrapingDepth} Layers</span>
                        </div>
                        <input type="range" min="1" max="15" step="1" value={systemConfig.scrapingDepth} onChange={(e) => setSystemConfig({...systemConfig, scrapingDepth: parseInt(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                      </div>
                   </div>
                </section>

                <section>
                   <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3"><Globe className="w-5 h-5 text-orange-500" /> Regional Geo-Fencing</h4>
                   <div className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-slate-800 shadow-xl">
                      <div className="flex flex-wrap gap-3 mb-6">
                        {systemConfig.geoFencing.map((f, i) => (
                          <div key={i} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3 group/tag hover:border-orange-500/30 transition-all">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{f}</span>
                            <button onClick={() => setSystemConfig({...systemConfig, geoFencing: systemConfig.geoFencing.filter((_, idx) => idx !== i)})} className="text-slate-700 hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                        <button 
                          onClick={() => {
                            const newTag = prompt("Enter Geo-Fence Code (e.g. LATAM):");
                            if (newTag) setSystemConfig({...systemConfig, geoFencing: [...systemConfig.geoFencing, newTag.toUpperCase()]});
                          }} 
                          className="px-4 py-2 bg-slate-800 border border-dashed border-slate-700 rounded-xl text-[10px] font-black text-slate-500 uppercase hover:border-blue-500 hover:text-blue-500 transition-all"
                        >
                          + Add Fence
                        </button>
                      </div>
                      <div className="p-4 bg-orange-600/5 border border-orange-500/10 rounded-2xl flex items-start gap-4">
                        <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0" />
                        <p className="text-[9px] text-slate-600 font-bold uppercase leading-relaxed">Compliance Filter active. All Neural Probes are restricted to selected trade zones. Local laws regarding data scraping and industrial privacy apply.</p>
                      </div>
                   </div>
                </section>
             </div>
          </div>
       </div>

       {/* Dynamic Integration Node Modal */}
       {isNodeModalOpen && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#050811]/95 backdrop-blur-2xl animate-in fade-in duration-300">
            <div className="bg-[#0c1220] border border-slate-800 w-full max-w-xl rounded-[4rem] overflow-hidden shadow-4xl animate-in zoom-in-95 duration-500" onClick={(e) => e.stopPropagation()}>
               <div className="p-12 bg-slate-900/20 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center border border-blue-500/20">
                        <Workflow className="w-8 h-8 text-blue-500" />
                     </div>
                     <div>
                        <h3 className="text-3xl font-black text-white tracking-tighter">Node Configuration</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Binding Interface</p>
                     </div>
                  </div>
                  <button onClick={() => setIsNodeModalOpen(false)} className="p-4 bg-slate-900 rounded-full text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
               </div>
               
               <div className="p-12 space-y-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Node Alias</label>
                     <input 
                        type="text" 
                        value={editingNode?.name || ''} 
                        onChange={(e) => setEditingNode({...editingNode, name: e.target.value})}
                        placeholder="e.g. Asia Logistics Pipeline"
                        className="w-full bg-slate-950 border border-slate-800 px-8 py-5 rounded-[2rem] text-sm font-black text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Pipeline Type</label>
                        <select 
                           value={editingNode?.type} 
                           onChange={(e) => setEditingNode({...editingNode, type: e.target.value as any})}
                           className="w-full bg-slate-950 border border-slate-800 px-6 py-4 rounded-2xl text-xs font-black text-white outline-none"
                        >
                           <option value="Market">Market Analysis</option>
                           <option value="Grounding">Web Grounding</option>
                           <option value="Logistics">Supply Chain</option>
                           <option value="Regulatory">Compliance</option>
                           <option value="Custom">Custom Bridge</option>
                        </select>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Service Tier</label>
                        <select 
                           value={editingNode?.tier} 
                           onChange={(e) => setEditingNode({...editingNode, tier: e.target.value as any})}
                           className="w-full bg-slate-950 border border-slate-800 px-6 py-4 rounded-2xl text-xs font-black text-white outline-none"
                        >
                           <option value="Standard">Standard</option>
                           <option value="Primary">Primary Hub</option>
                           <option value="Enterprise">Enterprise</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Initial Status</label>
                     <div className="flex gap-4">
                        {['Operational', 'Offline', 'Degraded'].map(s => (
                           <button 
                              key={s} 
                              onClick={() => setEditingNode({...editingNode, status: s as any})}
                              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${editingNode?.status === s ? 'bg-blue-600 border-blue-500 text-white shadow-xl' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                           >
                              {s}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="p-12 bg-slate-900/10 border-t border-slate-800 flex gap-4">
                  <button onClick={() => setIsNodeModalOpen(false)} className="flex-1 py-5 bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-3xl hover:bg-slate-800 transition-all">Discard Changes</button>
                  <button onClick={handleSaveIntegrationNode} className="flex-1 py-5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3">
                     <Save className="w-4 h-4" /> Finalize Binding
                  </button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default ConfigView;
