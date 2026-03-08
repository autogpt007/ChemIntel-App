
import React from 'react';
import { NewsArticle } from '../types';
import { 
  Newspaper, ExternalLink, TrendingUp, TrendingDown, 
  Minus, Clock, Globe, Tag, AlertTriangle, Zap, Radar
} from 'lucide-react';

interface NewsFeedViewProps {
  news: NewsArticle[];
  loading: boolean;
  onRefresh: () => void;
}

const NewsFeedView: React.FC<NewsFeedViewProps> = ({ news, loading, onRefresh }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="bg-[#0c1220] border border-slate-800 p-12 rounded-[4rem] space-y-10 relative overflow-hidden group shadow-3xl">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center shrink-0 ring-8 ring-blue-600/5 shadow-2xl">
            <Newspaper className="w-10 h-10 text-blue-500" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Neural News Feed</h2>
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Real-time Global Chemical Market Intelligence</p>
          </div>
          <button 
            onClick={onRefresh}
            disabled={loading}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Probing...' : 'Refresh Feed'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {news.length > 0 ? news.map((article) => (
          <div key={article.id} className="bg-[#0c1220] border border-slate-800 rounded-[3rem] p-8 flex flex-col relative group hover:border-blue-500/50 transition-all shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  article.sentiment === 'Positive' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                  article.sentiment === 'Negative' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                  'bg-slate-500/10 border-slate-500/20 text-slate-500'
                }`}>
                  {article.sentiment} Impact
                </div>
                <span className="px-3 py-1 bg-blue-600/10 text-blue-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-500/20">
                  Score: {article.impactScore}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase">{article.timestamp}</span>
              </div>
            </div>

            <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors mb-4 leading-tight">
              {article.title}
            </h3>
            
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
              {article.summary}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {article.relatedChemicals.map((chem, i) => (
                <span key={i} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Tag className="w-2 h-2" /> {chem}
                </span>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
                  <Globe className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase">Source</p>
                  <p className="text-[10px] font-bold text-white">{article.source}</p>
                </div>
              </div>
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-widest transition-all"
              >
                Full Intel <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center space-y-6">
            <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto border border-slate-800">
              <Radar className="w-10 h-10 text-slate-700 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Probing Global Channels</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Synchronizing Neural News Feed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeedView;
