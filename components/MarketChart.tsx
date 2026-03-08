
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ForecastData } from '../types';

interface MarketChartProps {
  data: ForecastData[];
  title: string;
}

const MarketChart: React.FC<MarketChartProps> = ({ data, title }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl h-80">
      <h3 className="text-sm font-medium text-slate-400 mb-6 uppercase tracking-wider">{title}</h3>
      <div className="w-full h-64 min-h-[256px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={0}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Area type="monotone" dataKey="demand" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDemand)" strokeWidth={2} />
            <Line type="monotone" dataKey="supply" stroke="#94a3b8" strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketChart;
