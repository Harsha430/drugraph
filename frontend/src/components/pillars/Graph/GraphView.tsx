import React, { useCallback, useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../../../store';
import { api } from '../../../services/api';
import { 
  Maximize2, 
  Layers, 
  MousePointer2, 
  Activity,
  Filter,
  Loader2
} from 'lucide-react';

export function GraphView() {
  const fgRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const { 
    graphDepth, 
    setGraphDepth, 
    pathfindMode, 
    togglePathfindMode, 
    addToast,
  } = useAppStore();

  const [filterType, setFilterType] = useState<'all' | 'Drug' | 'Target' | 'Category'>('all');

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) setDimensions({ width, height });
      }
    });
    ro.observe(containerRef.current);
    // seed initial size
    const { width, height } = containerRef.current.getBoundingClientRect();
    if (width > 0 && height > 0) setDimensions({ width, height });
    return () => ro.disconnect();
  }, []);

  const { data: graphData = { nodes: [], links: [] }, isFetching } = useQuery({
    queryKey: ['graph', graphDepth],
    queryFn: () => api.getGraph(graphDepth * 100), // Increase nodes with depth
    staleTime: 1000 * 60 * 5,
  });

  // Filter graph data — guard against null node refs (ForceGraph mutates source/target)
  const filteredData = {
    nodes: graphData.nodes.filter(n => n && n.id != null && (filterType === 'all' || n.type === filterType)),
    links: graphData.links.filter(l => {
      if (!l || l.source == null || l.target == null) return false;
      const sourceId = typeof l.source === 'object' ? (l.source as any)?.id : l.source;
      const targetId = typeof l.target === 'object' ? (l.target as any)?.id : l.target;
      if (sourceId == null || targetId == null) return false;

      if (filterType === 'all') return true;

      const sourceNode = graphData.nodes.find(n => n?.id === sourceId);
      const targetNode = graphData.nodes.find(n => n?.id === targetId);
      if (!sourceNode || !targetNode) return false;
      return sourceNode.type === filterType || targetNode.type === filterType;
    })
  };

  const handleNodeClick = useCallback((node: any) => {
    addToast(`Inspecting ${node.label}...`, 'info');
    if (node.type === 'Drug') {
      // Logic for selecting drug in graph
    }
  }, [addToast]);

  const getNodeColor = (node: any) => {
    switch (node.type) {
      case 'Drug': return 'var(--accent-bio)';
      case 'Target': return 'var(--accent-warm)';
      case 'Category': return 'var(--text-secondary)';
      default: return 'var(--text-muted)';
    }
  };

  const getNodeSize = (node: any) => {
    switch (node.type) {
      case 'Drug': return 6;
      case 'Target': return 4;
      case 'Category': return 5;
      default: return 3;
    }
  };

  const getLinkColor = (link: any) => {
    if (link.type === 'INTERACTS_WITH') {
      return 'rgba(255, 69, 96, 0.4)';
    }
    return 'rgba(58, 85, 112, 0.15)';
  };

  return (
    <div className="flex-1 relative flex flex-col bg-void overflow-hidden animate-fade-in group">
      {/* Background Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ opacity: 0.03 }}>
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(var(--accent-bio) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="absolute top-6 left-6 z-10 flex flex-col gap-4">
        {/* Connection Pulse */}
        <div className="flex items-center gap-3 px-4 py-2 bg-surface border border-accent-dim rounded-full shadow-lg">
          {isFetching ? <Loader2 size={14} className="text-accent-bio animate-spin" /> : <Activity size={14} className="text-accent-bio animate-pulse" />}
          <span className="font-display text-[11px] text-text-primary tracking-widest">
            {isFetching ? 'SYNCING DATABASE...' : 'NEURAL NETWORK ACTIVE'}
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-1 p-3 bg-surface border border-accent-dim rounded-lg shadow-xl">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Filter size={12} className="text-text-muted" />
            <span className="font-display text-[9px] text-text-muted tracking-widest">ENTITY FILTERS</span>
          </div>
          {(['all', 'Drug', 'Target', 'Category'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className="flex items-center gap-2 px-2 py-1.5 rounded transition-all hover:bg-white/5 text-left"
              style={{
                background: filterType === type ? 'rgba(0, 229, 195, 0.1)' : 'transparent',
              }}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ background: type === 'all' ? 'var(--text-primary)' : getNodeColor({ type }) }} 
              />
              <span className={`font-mono text-[10px] tracking-wide ${filterType === type ? 'text-accent-bio' : 'text-text-secondary'}`}>
                {type.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Graph Area */}
      <div ref={containerRef} className="flex-1 z-0 cursor-crosshair graph-canvas" style={{ position: 'relative' }}>
        <ForceGraph2D
          ref={fgRef}
          graphData={filteredData}
          width={dimensions.width}
          height={dimensions.height}
          nodeLabel="label"
          nodeColor={getNodeColor}
          nodeVal={getNodeSize}
          linkColor={getLinkColor}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleWidth={1.5}
          backgroundColor="transparent"
          onNodeClick={handleNodeClick}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
        />
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 px-6 py-3 bg-surface border border-accent-dim rounded-full shadow-2xl">
        <div className="flex items-center gap-6 border-r border-accent-dim pr-6 mr-2">
          <div className="flex flex-col gap-1">
            <span className="font-display text-[8px] text-text-muted tracking-widest text-center">SCAN DEPTH</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  onClick={() => setGraphDepth(d as 1 | 2 | 3)}
                  className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[10px] transition-all ${
                    graphDepth === d 
                      ? 'bg-accent-bio text-void shadow-[0_0_10px_rgba(0,229,195,0.4)]' 
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="p-2 text-text-secondary hover:text-accent-bio transition-colors"
            title="Zoom To Fit"
            onClick={() => fgRef.current?.zoomToFit(400)}
          >
            <Maximize2 size={18} />
          </button>
          
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded font-display text-[11px] tracking-widest transition-all ${
              pathfindMode 
                ? 'bg-accent-warm text-void shadow-[0_0_15px_rgba(232,168,56,0.2)]'
                : 'text-text-secondary hover:bg-white/5'
            }`}
            onClick={togglePathfindMode}
          >
            <MousePointer2 size={14} />
            {pathfindMode ? 'PATHFINDING ON' : 'PATHFINDING OFF'}
          </button>
        </div>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-6 right-6 z-10 p-4 bg-surface border border-accent-dim rounded-lg shadow-xl max-w-[200px]">
        <h4 className="font-display text-[10px] text-text-primary tracking-widest mb-3 border-b border-accent-dim pb-2">GRAPH LEGEND</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[rgba(255,69,96,1)] shadow-[0_0_8px_rgba(255,69,96,1)]" />
            <span className="font-mono text-[9px] text-text-muted tracking-wider">COLLISION / INTERACTION</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 rounded-full bg-accent-bio/20 border-l-2 border-accent-bio" />
            <span className="font-mono text-[9px] text-text-muted tracking-wider">DRUG NODE</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-warm" />
            <span className="font-mono text-[9px] text-text-muted tracking-wider">MOLECULAR TARGET</span>
          </div>
        </div>
      </div>
    </div>
  );
}
