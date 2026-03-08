
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { 
  TrendingUp, TrendingDown, MessageSquare, Newspaper, 
  BarChart3, Loader2, Search, AlertCircle, Activity,
  Globe, Zap, Shield
} from 'lucide-react';

interface SentimentSignal {
  source: string;
  headline: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  impactScore: number;
  date: string;
}

interface SentimentSummary {
  overallScore: number; // 0-100
  dominantTrend: 'Bullish' | 'Bearish' | 'Stable';
  keyDrivers: string[];
  signals: SentimentSignal[];
}

const SentimentEngine: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SentimentSummary | null>(null);

  const analyzeSentiment = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const result = await geminiService.analyzeSentiment(query);
      setSummary(result);
    } catch (error) {
      console.error("Sentiment analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="bg-[#0c1220] border border-slate-800 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center shrink-0 ring-8 ring-indigo-600/5 shadow-2xl">
            <MessageSquare className="w-10 h-10 text-indigo-500" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Neural Sentiment Engine</h2>
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Real-time Market Mood & News Impact Analysis</p>
          </div>
        </div>

        <div className="max-w-4xl mt-12 flex flex-col md:flex-row gap-6 bg-[#050811] p-6 rounded-[2.5rem] border border-slate-800 shadow-3xl relative">
          <div className="flex-1 flex gap-4 px-4 items-center">
            <Search className="w-6 h-6 text-slate-700" />
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Analyze asset sentiment (e.g. Lithium Carbonate)..." 
              className="flex-1 bg-transparent text-xl text-white outline-none font-bold" 
            />
          </div>
          <button 
            onClick={analyzeSentiment} 
            disabled={loading} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-5 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 flex items-center gap-3"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? 'ANALYZING...' : 'ANALYZE'}
          </button>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
          {/* Summary Stats */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] shadow-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Sentiment Score</p>
              <div className="flex items-end gap-4 mb-8">
                <span className="text-7xl font-black text-white">{summary.overallScore}</span>
                <span className={`text-xl font-black uppercase mb-2 ${summary.dominantTrend === 'Bullish' ? 'text-emerald-500' : 'text-blue-500'}`}>
                  {summary.dominantTrend}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${summary.dominantTrend === 'Bullish' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${summary.overallScore}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] shadow-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Key Market Drivers</p>
              <div className="space-y-4">
                {summary.keyDrivers?.map((driver, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 shrink-0"></div>
                    <p className="text-sm font-bold text-slate-300">{driver}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Signals List */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Neural Signal Stream</p>
            {summary.signals?.map((signal, i) => (
              <div key={i} className="bg-[#0c1220] border border-slate-800 p-8 rounded-[2.5rem] flex gap-8 items-center group hover:border-indigo-500/30 transition-all shadow-2xl">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${
                  signal.sentiment === 'Positive' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                  signal.sentiment === 'Negative' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                  'bg-blue-500/10 border-blue-500/20 text-blue-500'
                }`}>
                  {signal.sentiment === 'Positive' ? <TrendingUp className="w-8 h-8" /> : 
                   signal.sentiment === 'Negative' ? <TrendingDown className="w-8 h-8" /> : 
                   <Activity className="w-8 h-8" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{signal.source}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{signal.date}</span>
                  </div>
                  <h4 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors leading-tight mb-4">
                    {signal.headline}
                  </h4>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-slate-600" />
                      <span className="text-[10px] font-black text-slate-500 uppercase">Impact: {signal.impactScore}/100</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3 text-slate-600" />
                      <span className="text-[10px] font-black text-slate-500 uppercase">Global Reach</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentEngine;
