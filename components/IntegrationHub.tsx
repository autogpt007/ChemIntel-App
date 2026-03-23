
import React, { useState, useEffect } from 'react';
import { 
  Globe, Shield, Zap, Database, Search, Network, 
  Ship, FileCheck, BarChart3, Info, ExternalLink,
  Activity, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { integrationService } from '../services/integrationService';

const IntegrationHub: React.FC = () => {
  const [activeResource, setActiveResource] = useState<string | null>(null);
  const [logisticsData, setLogisticsData] = useState<any>(null);
  const [complianceData, setComplianceData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const logistics = await integrationService.fetchLogisticsData('Shanghai', 'Rotterdam');
      const compliance = await integrationService.checkCompliance('Ethylene Glycol', 'Europe');
      setLogisticsData(logistics);
      setComplianceData(compliance);
    };
    loadData();
  }, []);

  const resources = [
    {
      id: 'pubchem',
      name: 'PubChem Intelligence',
      description: 'Real-time chemical property and safety data synchronization.',
      status: 'Connected',
      icon: Database,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      id: 'gdelt',
      name: 'GDELT Global Monitor',
      description: 'Monitoring 100+ languages for geopolitical trade risks.',
      status: 'Active',
      icon: Globe,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100'
    },
    {
      id: 'logistics',
      name: 'Neural Logistics',
      description: 'Predictive shipping congestion and route optimization.',
      status: 'Syncing',
      icon: Ship,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      id: 'compliance',
      name: 'REACH/GHS Sentinel',
      description: 'Automated regulatory compliance and hazard monitoring.',
      status: 'Protected',
      icon: Shield,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-100'
    }
  ];

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="max-w-4xl">
        <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-4">Integration Hub</h2>
        <p className="text-slate-500 text-sm lg:text-base font-medium leading-relaxed">
          The ChemIntel platform leverages a massive cluster of external intelligence nodes to provide a 
          billion-dollar competitive edge. From real-time logistics to geopolitical sentiment, 
          every data point is search-grounded and verified.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {resources.map((resource) => (
          <div 
            key={resource.id}
            className={`bg-white border ${resource.border} p-8 lg:p-10 rounded-[2.5rem] shadow-sm card-hover relative overflow-hidden group`}
          >
            <div className="flex justify-between items-start mb-8">
              <div className={`${resource.bg} p-4 rounded-2xl shadow-lg shadow-slate-200/50`}>
                <resource.icon className={`${resource.color} w-6 h-6 lg:w-8 lg:h-8`} />
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${resource.status === 'Connected' || resource.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`}></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{resource.status}</span>
              </div>
            </div>
            
            <h3 className="text-xl lg:text-2xl font-black text-slate-900 mb-3 tracking-tight">{resource.name}</h3>
            <p className="text-slate-500 text-xs lg:text-sm font-bold leading-relaxed mb-8">{resource.description}</p>
            
            <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" /> View Node Details
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-950 rounded-[3rem] p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <h3 className="text-2xl lg:text-4xl font-black tracking-tighter mb-8 flex items-center gap-4">
              <Ship className="text-blue-500 w-8 h-8 lg:w-10 lg:h-10" /> Neural Logistics Feed
            </h3>
            
            {logisticsData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Route</p>
                    <p className="text-xl font-black text-blue-400">{logisticsData.route}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Avg Transit Time</p>
                    <p className="text-xl font-black">{logisticsData.avgTransitTime}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Congestion Level</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full w-1/2"></div>
                      </div>
                      <span className="text-sm font-black text-yellow-500">{logisticsData.congestionLevel}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl border border-slate-800">
                    <Activity className="text-emerald-500 w-5 h-5" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase">Risk Assessment</p>
                      <p className="text-xs font-black text-emerald-500 uppercase">{logisticsData.riskLevel} Risk Corridor</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center">
                <Zap className="w-12 h-12 text-slate-800 animate-pulse mx-auto mb-4" />
                <p className="text-slate-500 font-black uppercase tracking-widest">Initializing Logistics Node...</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[3rem] p-8 lg:p-10 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-8 flex items-center gap-3">
            <Shield className="text-orange-500 w-6 h-6" /> Compliance Sentinel
          </h3>
          
          {complianceData ? (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="text-emerald-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Status</p>
                  <p className="text-sm font-black text-slate-900 uppercase">{complianceData.status}</p>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-4">Hazard Classification</p>
                <div className="flex items-center gap-3 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-lg font-black">{complianceData.hazard}</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[9px] font-black text-slate-400 uppercase">Regional Restrictions</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase">{complianceData.restriction}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <Search className="w-10 h-10 text-slate-100 animate-pulse mx-auto" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationHub;
