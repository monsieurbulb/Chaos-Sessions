
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { User, ProfileViewMode, PrivacyMode, ChainTransaction } from '../types';
import { X, ExternalLink, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface GenerativeProfileProps {
  user: User;
  viewMode: ProfileViewMode;
  privacyMode: PrivacyMode;
}

// Helper to generate a random hex address
const randomAddr = () => `0x${Math.random().toString(16).substring(2, 40)}`;

const generateMockTxs = (count: number, userAddress: string): ChainTransaction[] => {
  return Array.from({ length: count }).map((_, i) => {
    const isIncoming = Math.random() > 0.5;
    return {
      hash: `0x${Math.random().toString(16).substring(2, 64)}`,
      block: 18450000 + i,
      method: ['mint_feather', 'transfer', 'contract_call', 'sign_message', 'delegate'][Math.floor(Math.random() * 5)],
      timestamp: new Date(Date.now() - i * 1000000).toISOString(),
      value: (Math.random() * 1.5).toFixed(4),
      to: isIncoming ? userAddress : randomAddr(),
      // Adding extra prop for rendering logic (mocking `from`)
      // @ts-ignore
      from: isIncoming ? randomAddr() : userAddress, 
    } as ChainTransaction;
  });
};

export const GenerativeProfile: React.FC<GenerativeProfileProps> = ({ user, viewMode, privacyMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Graph View State: Pan/Zoom/Selection
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Reset visuals on mode change
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNodeId(null);
  }, [viewMode, privacyMode]);

  // Memoize transactions so they don't regenerate on every render
  const txs = useMemo(() => 
    generateMockTxs(privacyMode === 'public' ? 100 : 25, user.address), 
  [privacyMode, user.address]);

  // Generate nodes based on transaction history + center node
  const nodes = useMemo(() => {
      const uniqueAddrs = new Set<string>();
      txs.forEach(tx => {
          if (tx.to && tx.to !== user.address) uniqueAddrs.add(tx.to);
          // @ts-ignore
          if (tx.from && tx.from !== user.address) uniqueAddrs.add(tx.from);
      });
      
      // Limit nodes for performance/visuals
      const limit = privacyMode === 'private' ? 8 : 25;
      const addrs = Array.from(uniqueAddrs).slice(0, limit);

      return addrs.map((addr, i) => ({
           id: addr,
           // Distribute randomly but somewhat centrally
           x: 50 + (Math.random() - 0.5) * 60, 
           y: 50 + (Math.random() - 0.5) * 60,
           r: Math.random() * 3 + 2,
           color: i % 3 === 0 ? '#84a98c' : '#354f52'
      }));
  }, [txs, user.address, privacyMode]);

  // --- INTERACTION HANDLERS (Graph) ---

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== 'relations') return;
    // Simple zoom logic
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    const newZoom = Math.max(0.5, Math.min(zoom + delta, 4)); // Clamp 0.5x to 4x
    setZoom(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode !== 'relations') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || viewMode !== 'relations') return;
    
    // Calculate drag delta
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    // Convert screen pixels to approximate SVG units (assuming 100x100 viewbox matches container roughly)
    // We scale down the movement to make it feel "weighted"
    const sensitivity = 0.1 / zoom; 
    
    setPan(p => ({ x: p.x + dx * sensitivity, y: p.y + dy * sensitivity }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation(); // Prevent drag start
    setSelectedNodeId(nodeId);
  };


  // --- SEED VIEW: Flow Field Generative Art ---
  useEffect(() => {
    if (viewMode !== 'seed' || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    // Seed derivation
    const seedVal = user.address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Config
    const particleCount = privacyMode === 'public' ? 500 : 300;
    const noiseScale = privacyMode === 'public' ? 0.005 : 0.008;
    const baseSpeed = privacyMode === 'public' ? 1.5 : 1.0;
    
    // DYNAMIC PALETTES based on privacy mode
    // Expanding beyond the strict app theme for the visualizer
    const palette = privacyMode === 'public' 
      ? [
          '#F59E0B', // Amber (Value Transfer)
          '#8B5CF6', // Violet (Contracts)
          '#EC4899', // Pink (High Priority)
          '#06B6D4', // Cyan (Data)
          '#10B981', // Emerald (Verification)
          '#ffffff', // White (Sync)
        ]
      : [
          '#2A9D8F', // Teal
          '#E9C46A', // Sand
          '#F4A261', // Orange
          '#E76F51', // Burnt Sienna
          '#84a98c', // Sage
        ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      age: number;
      life: number;
      type: 'transfer' | 'contract' | 'signal';
    }

    interface Flash {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      color: string;
    }

    const particles: Particle[] = [];
    let flashes: Flash[] = [];

    // Initialize particles with "types" derived from randomness seeded by address
    for(let i=0; i<particleCount; i++) {
       const typeRand = Math.random();
       let color = palette[0];
       let type: Particle['type'] = 'signal';
       
       if (typeRand > 0.8) {
         color = palette[1]; // Contract
         type = 'contract';
       } else if (typeRand > 0.5) {
         color = palette[Math.floor(Math.random() * palette.length)]; // Transfer
         type = 'transfer';
       }

       particles.push({
         x: Math.random() * width,
         y: Math.random() * height,
         vx: 0,
         vy: 0,
         color,
         age: 0,
         life: Math.random() * 200 + 100,
         type
       });
    }

    let animationId: number;
    let time = 0;

    const render = () => {
       // Trail effect: clear with low opacity black
       // Using 'source-over' for clearing
       ctx.globalCompositeOperation = 'source-over';
       ctx.fillStyle = 'rgba(5, 5, 8, 0.1)'; // Very dark fade
       ctx.fillRect(0, 0, width, height);

       // Switch to additive mixing for glowing look
       ctx.globalCompositeOperation = 'lighter';

       time += 0.01;

       // 1. Render Particles
       particles.forEach(p => {
          // Flow field noise
          const angle = (Math.cos(p.x * noiseScale + seedVal) + Math.sin(p.y * noiseScale + time)) * Math.PI;
          
          p.vx += Math.cos(angle) * 0.1;
          p.vy += Math.sin(angle) * 0.1;
          
          // Speed variation based on particle type
          const limit = p.type === 'contract' ? baseSpeed * 1.5 : baseSpeed;
          
          const vel = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
          if (vel > limit) {
            p.vx = (p.vx/vel) * limit;
            p.vy = (p.vy/vel) * limit;
          }

          p.x += p.vx;
          p.y += p.vy;
          p.age++;

          // Wrap edges
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Randomly trigger a flash based on particle movement/interaction
          // Simulating a "Transaction Event"
          if (Math.random() < 0.001) {
             flashes.push({
               x: p.x,
               y: p.y,
               radius: 1,
               maxRadius: Math.random() * 30 + 10,
               alpha: 1,
               color: p.color
             });
          }

          // Draw
          ctx.beginPath();
          ctx.arc(p.x, p.y, privacyMode === 'public' ? 1 : 1.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Reset dead particles
          if (p.age > p.life) {
             p.x = Math.random() * width;
             p.y = Math.random() * height;
             p.age = 0;
             p.vx = 0;
             p.vy = 0;
          }
       });

       // 2. Render Flashes
       for (let i = flashes.length - 1; i >= 0; i--) {
          const f = flashes[i];
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fillStyle = f.color; // Using the color directly with globalAlpha handling usually better, but manual fade works too
          ctx.globalAlpha = f.alpha;
          ctx.fill();
          ctx.globalAlpha = 1.0;

          f.radius += 1;
          f.alpha -= 0.05;

          if (f.alpha <= 0 || f.radius >= f.maxRadius) {
             flashes.splice(i, 1);
          }
       }

       animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [viewMode, privacyMode, user.address]);


  // --- RENDERERS ---

  const renderTransactions = () => (
    <div className="w-full h-full overflow-hidden relative font-mono text-xs bg-black flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-chaos-border bg-chaos-panel">
         <span className="text-chaos-muted uppercase tracking-widest text-[10px]">Recent Activity Log</span>
         <span className="text-chaos-organic">{txs.length} entries found</span>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
        {txs.map((tx, i) => {
           const methodColor = tx.method === 'mint_feather' ? 'text-chaos-accent' : 
                               tx.method === 'transfer' ? 'text-blue-400' : 'text-stone-400';
           // @ts-ignore
           const isFromMe = tx.from === user.address;

           return (
            <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-6 p-3 rounded border border-chaos-border hover:border-chaos-organic/50 bg-chaos-black/50 transition-colors">
              
              <div className="flex flex-col gap-1 min-w-[120px]">
                 <span className={`${methodColor} font-bold uppercase`}>{tx.method.replace('_', ' ')}</span>
                 <span className="text-[10px] text-stone-600">{new Date(tx.timestamp).toLocaleTimeString()}</span>
              </div>

              <div className="flex-1 flex flex-col gap-1">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-500 uppercase w-8">Hash</span>
                    <span className="text-chaos-text truncate">{tx.hash}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-500 uppercase w-8">{isFromMe ? 'To' : 'From'}</span>
                    <span className="text-chaos-muted truncate font-mono">
                      {/* @ts-ignore */}
                      {isFromMe ? tx.to : tx.from}
                    </span>
                 </div>
              </div>

              <div className="flex flex-col items-end justify-center min-w-[80px]">
                 <span className="text-white font-medium">{tx.value} KSM</span>
                 <span className="text-[10px] text-stone-600">Block {tx.block}</span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMetadataOverlay = () => {
    if (!selectedNodeId) return null;

    // Filter transactions relevant to this node
    const relevantTxs = txs.filter(tx => 
      // @ts-ignore
      tx.to === selectedNodeId || tx.from === selectedNodeId
    );

    return (
      <div className="absolute top-4 right-4 bottom-4 w-80 bg-chaos-black/95 border border-chaos-border rounded-lg shadow-2xl backdrop-blur-md flex flex-col animate-fade-in z-20">
         <div className="p-4 border-b border-chaos-border flex items-center justify-between">
            <div className="flex items-center gap-2">
               <ExternalLink className="w-4 h-4 text-chaos-accent" />
               <span className="text-xs font-mono text-white uppercase tracking-wider">Interaction Data</span>
            </div>
            <button onClick={() => setSelectedNodeId(null)} className="text-chaos-muted hover:text-white">
              <X className="w-4 h-4" />
            </button>
         </div>
         
         <div className="p-4 bg-chaos-panel/50 border-b border-chaos-border">
            <label className="block text-[10px] text-chaos-muted uppercase mb-1">Peer Identity</label>
            <div className="font-mono text-xs text-white break-all bg-black p-2 rounded border border-chaos-border/50">
              {selectedNodeId}
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex justify-between text-xs text-chaos-muted font-mono mb-2">
               <span>History</span>
               <span>{relevantTxs.length} Transactions</span>
            </div>
            
            {relevantTxs.length === 0 ? (
               <div className="text-center py-8 text-chaos-muted text-xs italic">
                 No direct transactions found in this batch.
                 <br/>(Calculated via graph distance)
               </div>
            ) : (
              relevantTxs.map((tx, i) => (
                <div key={i} className="p-3 rounded bg-black/40 border border-chaos-border hover:border-chaos-organic transition-colors group cursor-pointer">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-chaos-text uppercase">{tx.method}</span>
                      <span className="text-[10px] text-chaos-muted">{new Date(tx.timestamp).toLocaleDateString()}</span>
                   </div>
                   <div className="text-[10px] font-mono text-chaos-muted truncate mb-2">
                     {tx.hash}
                   </div>
                   <div className="flex justify-between items-end border-t border-chaos-border/30 pt-2">
                      <span className="text-[10px] text-stone-500">Block {tx.block}</span>
                      <span className="text-xs font-mono text-white">{tx.value} KSM</span>
                   </div>
                </div>
              ))
            )}
         </div>
      </div>
    );
  };

  const renderRelations = () => {
    return (
      <div 
        className="w-full h-full bg-chaos-black relative overflow-hidden cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full block">
           <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
           </defs>
           
           {/* Zoom/Pan Group */}
           <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`} transform-origin="50 50">
             
             {/* Center Node (User) */}
             <circle cx="50" cy="50" r="4" className="fill-white" filter="url(#glow)" />
             <text x="50" y="60" fontSize="2" fill="#888" textAnchor="middle" className="font-mono">YOU</text>
             
             {/* Links */}
             {nodes.map((node, i) => (
                <line 
                  key={`link-${i}`}
                  x1="50" y1="50"
                  x2={node.x} y2={node.y}
                  stroke={node.color}
                  strokeWidth={0.2 / zoom} // Keep lines thin regardless of zoom
                  strokeOpacity="0.4"
                />
             ))}

             {/* Nodes */}
             {nodes.map((node, i) => (
               <g 
                 key={`node-${i}`} 
                 onClick={(e) => handleNodeClick(e, node.id)}
                 className="cursor-pointer hover:opacity-80"
               >
                 <circle 
                    cx={node.x} cy={node.y} r={node.r} 
                    fill={node.color} 
                    className="transition-all duration-300"
                    stroke={selectedNodeId === node.id ? '#fff' : 'none'}
                    strokeWidth={0.5}
                 >
                   <animate 
                     attributeName="r" 
                     values={`${node.r};${node.r + 0.5};${node.r}`} 
                     dur={`${3 + i}s`} 
                     repeatCount="indefinite" 
                   />
                 </circle>
                 {/* Only show label if zoomed in enough or hovered/selected */}
                 {(zoom > 1.5 || selectedNodeId === node.id) && (
                    <text x={node.x} y={node.y + node.r + 3} fontSize="2" fill="#aaa" textAnchor="middle" className="font-mono bg-black">
                        {node.id.substring(0, 6)}...
                    </text>
                 )}
               </g>
             ))}
           </g>
        </svg>
        
        {/* Controls Overlay */}
        <div className="absolute bottom-4 left-4 p-4 bg-black/80 backdrop-blur border border-chaos-border rounded max-w-xs pointer-events-none">
           <h4 className="text-white text-xs font-bold uppercase mb-1 flex items-center gap-2">
             <Move className="w-3 h-3" />
             Navigation
           </h4>
           <div className="text-[10px] text-chaos-muted font-mono leading-relaxed">
             Scroll to Zoom ({zoom.toFixed(1)}x)<br/>
             Drag to Pan
           </div>
        </div>

        {/* Metadata Modal */}
        {renderMetadataOverlay()}

      </div>
    );
  };

  return (
    <div ref={containerRef} className="absolute inset-0 bg-black">
      {viewMode === 'seed' && <canvas ref={canvasRef} className="w-full h-full block" />}
      {viewMode === 'transactions' && renderTransactions()}
      {viewMode === 'relations' && renderRelations()}
      
      {/* Overlay Info Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none z-10">
        <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded border border-chaos-border">
          <span className="text-[10px] font-mono text-chaos-accent uppercase tracking-widest">
            {viewMode} LAYER // {privacyMode}
          </span>
        </div>
      </div>
    </div>
  );
};
