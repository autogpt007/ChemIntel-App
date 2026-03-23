
import React, { useState, useEffect, useRef } from 'react';
import { 
  BrainCircuit, Terminal, Zap, Shield, Globe, 
  Truck, Send, Loader2, Sparkles, Activity,
  Cpu, Network, Database, Lock, TrendingUp
} from 'lucide-react';
import { AgentMessage } from '../types';
import { agentService } from '../services/agentService';
import Markdown from 'react-markdown';

const NeuralCouncilView: React.FC = () => {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      agent: 'The Architect',
      content: '# Neural Council Initialized\n\nWelcome to the **Agentic Command Center**. I am **The Architect**, overseeing the ChemIntel Neural Council. \n\nOur specialized agents are currently monitoring global market nodes. How shall we proceed with ecosystem optimization?',
      timestamp: new Date().toLocaleTimeString(),
      status: 'complete',
      thoughtStream: ["Initializing Orchestrator...", "Syncing with Market Recon...", "Establishing Compliance Perimeter..."]
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMsg: AgentMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await agentService.processCouncilMessage(input, messages);
      setMessages(prev => [...prev, ...response]);
    } catch (error) {
      console.error("Neural Council error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="h-auto lg:h-[calc(100vh-180px)] flex flex-col gap-6 lg:gap-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-12 gap-6 lg:gap-8 h-full">
        {/* Chat Area */}
        <div className="col-span-12 lg:col-span-8 flex flex-col bg-[#0c1220] border border-slate-800 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-3xl">
          <div className="p-6 lg:p-8 bg-[#050811] border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600/10 rounded-xl lg:rounded-2xl flex items-center justify-center border border-blue-500/20">
                <BrainCircuit className="w-6 h-6 lg:w-7 lg:h-7 text-blue-500" />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-black text-white tracking-tighter uppercase">Neural Council Command</h2>
                <p className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest">Agentic Orchestration Layer</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 lg:px-4 lg:py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] lg:text-[10px] font-black text-emerald-500 uppercase">All Systems Nominal</span>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 lg:space-y-10 scrollbar-hide min-h-[400px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] lg:max-w-[80%] space-y-3 lg:space-y-4 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.agent && (
                    <div className="flex items-center gap-2 lg:gap-3 ml-2">
                      <span className="px-2 py-0.5 bg-blue-600/10 text-blue-500 rounded text-[8px] lg:text-[10px] font-black uppercase tracking-widest border border-blue-500/20">{msg.agent}</span>
                      <span className="text-[8px] lg:text-[10px] font-bold text-slate-600 uppercase">{msg.timestamp}</span>
                    </div>
                  )}
                  <div className={`p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] text-base lg:text-lg leading-relaxed shadow-xl relative group ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-[#050811] border border-slate-800 text-slate-300 rounded-tl-none'
                  }`}>
                    <div className="markdown-body">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                    
                    {msg.metadata && (
                      <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-4">
                        {msg.metadata.confidence && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <Activity className="w-3 h-3 text-emerald-500" />
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Confidence: {msg.metadata.confidence}%</span>
                          </div>
                        )}
                        {msg.metadata.mathModel && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <Cpu className="w-3 h-3 text-blue-500" />
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Model: {msg.metadata.mathModel}</span>
                          </div>
                        )}
                        {msg.agent === 'Quantum Forecaster' && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <Zap className="w-3 h-3 text-yellow-500" />
                            <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">Quantum Verified</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {msg.thoughtStream && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mt-4">
                      {msg.thoughtStream.map((thought, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 lg:p-4 bg-slate-900/50 border border-slate-800 rounded-xl lg:rounded-2xl text-[10px] lg:text-xs font-bold text-slate-500 uppercase animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                          <Terminal className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500" />
                          {thought}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-[#050811] border border-slate-800 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] rounded-tl-none flex items-center gap-4 lg:gap-6">
                  <Loader2 className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 animate-spin" />
                  <div className="space-y-1">
                    <p className="text-xs lg:text-sm font-black text-white uppercase tracking-widest">Council Deliberating</p>
                    <p className="text-[8px] lg:text-[10px] font-bold text-slate-500 uppercase animate-pulse">Synthesizing Agent Intelligence...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 lg:p-10 bg-[#050811] border-t border-slate-800">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Issue a directive..."
                className="w-full bg-slate-900 border border-slate-800 rounded-[1.5rem] lg:rounded-[2rem] px-6 lg:px-10 py-4 lg:py-6 text-base lg:text-xl text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all pr-20 lg:pr-24"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className="absolute right-2 lg:right-4 top-2 lg:top-4 bottom-2 lg:bottom-4 px-4 lg:px-8 bg-blue-600 text-white rounded-xl lg:rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all disabled:opacity-50 shadow-xl shadow-blue-600/20"
              >
                <Send className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-span-12 lg:col-span-4 space-y-6 lg:space-y-8">
          <div className="bg-[#0c1220] border border-slate-800 p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-3xl">
            <h3 className="text-[10px] lg:text-xs font-black text-white uppercase tracking-[0.3em] mb-6 lg:mb-10 flex items-center gap-3">
              <Cpu className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" /> Active Agents
            </h3>
            <div className="space-y-4 lg:space-y-6">
              {[
                { name: 'The Architect', role: 'Orchestrator', icon: BrainCircuit, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { name: 'Recon-01', role: 'Market Intel', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { name: 'Lead Hunter', role: 'Buyer Acquisition', icon: Database, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                { name: 'Quantum Forecaster', role: 'Predictive Analytics', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                { name: 'Quarterly Strategist', role: 'Product Optimization', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                { name: 'Compliance Officer', role: 'Regulatory', icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                { name: 'Logistics Strategist', role: 'Supply Chain', icon: Truck, color: 'text-orange-500', bg: 'bg-orange-500/10' }
              ].map((agent, i) => (
                <div key={i} className="flex items-center justify-between p-4 lg:p-6 bg-slate-900/50 border border-slate-800 rounded-xl lg:rounded-2xl group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 ${agent.bg} rounded-lg lg:rounded-xl flex items-center justify-center border border-white/5`}>
                      <agent.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${agent.color}`} />
                    </div>
                    <div>
                      <p className="text-xs lg:text-sm font-black text-white">{agent.name}</p>
                      <p className="text-[8px] lg:text-[10px] font-bold text-slate-500 uppercase">{agent.role}</p>
                    </div>
                  </div>
                  <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0c1220] border border-slate-800 p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-3xl">
            <h3 className="text-[10px] lg:text-xs font-black text-white uppercase tracking-[0.3em] mb-6 lg:mb-10 flex items-center gap-3">
              <Network className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-500" /> Council Metrics
            </h3>
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-3 lg:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase">Consensus Accuracy</span>
                  <span className="text-[10px] lg:text-xs font-black text-emerald-500">99.2%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[99.2%]"></div>
                </div>
              </div>
              <div className="space-y-3 lg:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase">Agent Latency</span>
                  <span className="text-[10px] lg:text-xs font-black text-blue-500">14ms</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[14%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralCouncilView;
