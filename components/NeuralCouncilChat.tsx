
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, Sparkles, Shield, Globe, 
  Truck, BrainCircuit, Loader2, ChevronDown, 
  Terminal, Zap, X, Maximize2, Minimize2, Database, TrendingUp
} from 'lucide-react';
import { AgentMessage } from '../types';
import { neuralCouncilService } from '../services/neuralCouncilService';
import Markdown from 'react-markdown';

const NeuralCouncilChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      agent: 'The Architect',
      content: 'Neural Council is online. I am The Architect. How shall we optimize the ChemIntel ecosystem today?',
      timestamp: new Date().toLocaleTimeString(),
      status: 'complete'
    }
  ]);
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
      const response = await neuralCouncilService.processMessage(input, messages);
      setMessages(prev => [...prev, ...response]);
    } catch (error) {
      console.error("Neural Council error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 transition-all duration-500 ease-in-out ${
      isOpen 
        ? (isMaximized ? 'w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] sm:w-[80vw] sm:h-[80vh]' : 'w-[calc(100vw-2rem)] h-[500px] sm:w-[450px] sm:h-[650px]') 
        : 'w-14 h-14 sm:w-16 h-16'
    }`}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40 hover:scale-110 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <BrainCircuit className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      ) : (
        <div className="w-full h-full bg-[#0c1220] border border-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-3xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 bg-[#050811] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-widest">Neural Council</h3>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase">Synchronized</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button onClick={() => setIsMaximized(!isMaximized)} className="p-2 text-slate-500 hover:text-white transition-colors hidden sm:block">
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] sm:max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.agent && (
                    <div className="flex items-center gap-2 ml-1">
                      <span className="text-[8px] sm:text-[9px] font-black text-blue-500 uppercase tracking-widest">{msg.agent}</span>
                      <span className="text-[7px] sm:text-[8px] font-bold text-slate-600 uppercase">{msg.timestamp}</span>
                    </div>
                  )}
                  <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none'
                  }`}>
                    <div className="markdown-body">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  </div>
                  {msg.thoughtStream && (
                    <div className="mt-2 space-y-1">
                      {msg.thoughtStream.map((thought, i) => (
                        <div key={i} className="flex items-center gap-2 text-[8px] sm:text-[9px] font-bold text-slate-600 uppercase animate-in fade-in slide-in-from-left-2 duration-500" style={{ animationDelay: `${i * 200}ms` }}>
                          <Terminal className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
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
                <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl rounded-tl-none flex items-center gap-3">
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 animate-spin" />
                  <span className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest animate-pulse">Council Deliberating...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 sm:p-6 bg-[#050811] border-t border-slate-800">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Command the council..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all pr-12 sm:pr-16"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 sm:px-4 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-50 text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500" />
                <span className="text-[7px] sm:text-[8px] font-black text-slate-600 uppercase">Compliance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-500" />
                <span className="text-[7px] sm:text-[8px] font-black text-slate-600 uppercase">Recon</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-500" />
                <span className="text-[7px] sm:text-[8px] font-black text-slate-600 uppercase">Leads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-500" />
                <span className="text-[7px] sm:text-[8px] font-black text-slate-600 uppercase">Quantum</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500" />
                <span className="text-[7px] sm:text-[8px] font-black text-slate-600 uppercase">Strategy</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeuralCouncilChat;
