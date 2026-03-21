
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
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="bg-white border border-slate-200 p-8 lg:p-12 rounded-[2rem] lg:rounded-[4rem] shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-center">
          <div className="w-16 h-16 lg:w-24 lg:h-24 bg-blue-50 rounded-full flex items-center justify-center shrink-0 ring-4 lg:ring-8 ring-blue-50 shadow-sm">
            <MessageSquare className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-2">Neural Sentiment Engine</h2>
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[8px] lg:text-[10px]">Real-time Market Mood & News Impact Analysis</p>
          </div>
        </div>

        <div className="max-w-4xl mt-8 lg:mt-12 flex flex-col md:flex-row gap-4 lg:gap-6 bg-slate-50 p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-200 shadow-sm relative">
          <div className="flex-1 flex gap-4 px-2 lg:px-4 items-center">
            <Search className="w-5 h-5 lg:w-6 lg:h-6 text-slate-300" />
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Analyze asset sentiment (e.g. Lithium Carbonate)..." 
              className="flex-1 bg-transparent text-lg lg:text-xl text-slate-900 outline-none font-bold placeholder:text-slate-300" 
            />
          </div>
          <button 
            onClick={analyzeSentiment} 
            disabled={loading} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 lg:px-12 py-4 lg:py-5 rounded-xl lg:rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[10px] lg:text-xs shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? 'ANALYZING...' : 'ANALYZE'}
          </button>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-12 gap-6 lg:gap-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
          {/* Summary Stats */}
          <div className="col-span-12 lg:col-span-4 space-y-6 lg:space-y-8">
            <div className="bg-white border border-slate-200 p-8 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-sm">
              <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 lg:mb-6">Sentiment Score</p>
              <div className="flex items-end gap-3 lg:gap-4 mb-6 lg:mb-8">
                <span className="text-5xl lg:text-7xl font-black text-slate-900">{summary.overallScore}</span>
                <span className={`text-lg lg:text-xl font-black uppercase mb-1 lg:mb-2 ${summary.dominantTrend === 'Bullish' ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {summary.dominantTrend}
                </span>
              </div>
              <div className="w-full h-2.5 lg:h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${summary.dominantTrend === 'Bullish' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${summary.overallScore}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-sm">
              <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 lg:mb-6">Key Market Drivers</p>
              <div className="space-y-3 lg:space-y-4">
                {summary.keyDrivers?.map((driver, i) => (
                  <div key={i} className="flex gap-3 lg:gap-4 items-start">
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full mt-1.5 lg:mt-2 shrink-0"></div>
                    <p className="text-xs lg:text-sm font-bold text-slate-600">{driver}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Signals List */}
          <div className="col-span-12 lg:col-span-8 space-y-4 lg:space-y-6">
            <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Neural Signal Stream</p>
            {summary.signals?.map((signal, i) => (
              <div key={i} className="bg-white border border-slate-200 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] flex flex-col sm:flex-row gap-6 lg:gap-8 items-start sm:items-center group hover:border-blue-500/30 transition-all shadow-sm card-hover">
                <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0 border ${
                  signal.sentiment === 'Positive' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                  signal.sentiment === 'Negative' ? 'bg-red-50 border-red-100 text-red-500' :
                  'bg-blue-50 border-blue-100 text-blue-600'
                }`}>
                  {signal.sentiment === 'Positive' ? <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8" /> : 
                   signal.sentiment === 'Negative' ? <TrendingDown className="w-6 h-6 lg:w-8 lg:h-8" /> : 
                   <Activity className="w-6 h-6 lg:w-8 lg:h-8" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] lg:text-[10px] font-black text-blue-600 uppercase tracking-widest">{signal.source}</span>
                    <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase">{signal.date}</span>
                  </div>
                  <h4 className="text-lg lg:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-3 lg:mb-4">
                    {signal.headline}
                  </h4>
                  <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-slate-300" />
                      <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase">Impact: {signal.impactScore}/100</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3 text-slate-300" />
                      <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase">Global Reach</span>
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
