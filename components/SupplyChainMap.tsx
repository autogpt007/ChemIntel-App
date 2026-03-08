
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SupplyChainData, SupplyChainNode, SupplyChainLink } from '../types';
import { ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SupplyChainMapProps {
  data: SupplyChainData;
  assetName: string;
}

const SupplyChainMap: React.FC<SupplyChainMapProps> = ({ data, assetName }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !data.nodes.length) return;

    const width = containerRef.current.clientWidth;
    const height = 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation<SupplyChainNode>(data.nodes)
      .force("link", d3.forceLink<SupplyChainNode, SupplyChainLink>(data.links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(80));

    // Define arrow markers for links
    svg.append("defs").selectAll("marker")
      .data(["Low", "Medium", "High"])
      .enter().append("marker")
      .attr("id", d => `arrowhead-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", d => d === 'High' ? '#ef4444' : d === 'Medium' ? '#f59e0b' : '#3b82f6');

    const link = svg.append("g")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("stroke", (d: SupplyChainLink) => d.riskLevel === 'High' ? '#ef4444' : d.riskLevel === 'Medium' ? '#f59e0b' : '#3b82f6')
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: SupplyChainLink) => Math.sqrt(d.value) * 2)
      .attr("marker-end", (d: SupplyChainLink) => `url(#arrowhead-${d.riskLevel})`);

    const node = svg.append("g")
      .selectAll(".node")
      .data(data.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag<SVGGElement, SupplyChainNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Node circles
    node.append("circle")
      .attr("r", 30)
      .attr("fill", (d: SupplyChainNode) => {
        if (d.status === 'Disrupted') return '#ef4444';
        if (d.status === 'At Risk') return '#f59e0b';
        return '#10b981';
      })
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .attr("class", "shadow-xl");

    // Node labels
    node.append("text")
      .attr("dy", 45)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", "10px")
      .attr("font-weight", "900")
      .attr("class", "uppercase tracking-tighter")
      .text((d: SupplyChainNode) => d.name);

    // Node type labels
    node.append("text")
      .attr("dy", 58)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "8px")
      .attr("font-weight", "bold")
      .attr("class", "uppercase tracking-widest")
      .text((d: SupplyChainNode) => `${d.type} | ${d.region}`);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: SupplyChainNode) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => { simulation.stop(); };
  }, [data]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-[#0c1220] border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-4xl font-black text-white tracking-tighter">Neural Supply Chain Map</h3>
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Asset: {assetName} | Global Flow Analysis</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-[9px] font-black text-emerald-500 uppercase">Stable</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span className="text-[9px] font-black text-orange-500 uppercase">At Risk</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span className="text-[9px] font-black text-red-500 uppercase">Disrupted</span>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="w-full bg-slate-950/50 rounded-[2.5rem] border border-slate-800/50 relative overflow-hidden">
          <svg ref={svgRef} width="100%" height="600" className="cursor-move"></svg>
          
          {/* Legend Overlay */}
          <div className="absolute bottom-8 left-8 p-6 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl space-y-3">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Neural Legend</p>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-[10px] font-bold text-slate-300">Low Risk Flow</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-[10px] font-bold text-slate-300">Medium Risk Flow</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-[10px] font-bold text-slate-300">High Risk Flow</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.nodes?.map(node => (
          <div key={node.id} className="bg-slate-900/60 border border-slate-800 p-6 rounded-[2rem] hover:border-blue-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                node.status === 'Disrupted' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                node.status === 'At Risk' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              }`}>
                {node.status}
              </span>
              <p className="text-[9px] font-black text-slate-600 uppercase">{node.region}</p>
            </div>
            <h4 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">{node.name}</h4>
            <p className="text-[10px] font-black text-slate-500 uppercase mt-1">{node.type}</p>
            {node.capacity && (
              <div className="mt-4 pt-4 border-t border-slate-800/50">
                <p className="text-[9px] font-black text-slate-600 uppercase">Annual Capacity</p>
                <p className="text-sm font-bold text-slate-300">{node.capacity}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplyChainMap;
