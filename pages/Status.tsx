
import React from 'react';
import { Activity, Server, Database, Wifi, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const Status: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="border-b border-chaos-border pb-8">
        <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
          <Activity className="w-8 h-8 text-chaos-accent" />
          Network Status
        </h1>
        <p className="text-chaos-muted text-lg mt-4 font-light">
          Real-time operational metrics for the Chaos Sessions decentralised infrastructure.
        </p>
      </div>

      {/* Main Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Virto Node */}
        <div className="p-6 bg-chaos-panel border border-chaos-border rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-chaos-muted uppercase">Latency: 45ms</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-black/40 rounded-lg">
              <Wifi className="w-6 h-6 text-chaos-organic" />
            </div>
            <div>
              <h3 className="text-white font-medium">Virto Identity Node</h3>
              <p className="text-xs text-chaos-muted">Authentication & Signatures</p>
            </div>
          </div>
          <div className="h-1 w-full bg-black rounded-full overflow-hidden">
             <div className="h-full bg-green-500 w-full"></div>
          </div>
          <div className="mt-4 flex gap-1">
             {[...Array(20)].map((_, i) => (
               <div key={i} className={`h-8 flex-1 rounded-sm ${Math.random() > 0.9 ? 'bg-amber-500/50' : 'bg-green-500/20'}`}></div>
             ))}
          </div>
          <div className="mt-2 text-[10px] text-chaos-muted font-mono flex justify-between">
            <span>24h Uptime</span>
            <span>99.9%</span>
          </div>
        </div>

        {/* Feather Indexer */}
        <div className="p-6 bg-chaos-panel border border-chaos-border rounded-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-amber-500 uppercase">Syncing</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-black/40 rounded-lg">
              <Database className="w-6 h-6 text-chaos-organic" />
            </div>
            <div>
              <h3 className="text-white font-medium">Feather Indexer</h3>
              <p className="text-xs text-chaos-muted">Event Log & Metadata</p>
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4 mt-6">
             <div className="p-2 bg-black/30 rounded border border-chaos-border">
               <span className="block text-[10px] text-chaos-muted uppercase mb-1">Block Height</span>
               <span className="font-mono text-white text-sm">#18,245,992</span>
             </div>
             <div className="p-2 bg-black/30 rounded border border-chaos-border">
               <span className="block text-[10px] text-chaos-muted uppercase mb-1">Feathers</span>
               <span className="font-mono text-white text-sm">1,204</span>
             </div>
           </div>
        </div>

        {/* Livepeer Orchestrator */}
        <div className="p-6 bg-chaos-panel border border-chaos-border rounded-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-black/40 rounded-lg">
              <Server className="w-6 h-6 text-chaos-organic" />
            </div>
            <div>
              <h3 className="text-white font-medium">Livepeer Orchestrator</h3>
              <p className="text-xs text-chaos-muted">Transcoding & CDN</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-chaos-muted font-mono">
              <span>Transcode Reliability</span>
              <span className="text-white">100%</span>
            </div>
             <div className="flex justify-between text-xs text-chaos-muted font-mono">
              <span>Active Streams</span>
              <span className="text-white">4</span>
            </div>
          </div>
        </div>

         {/* IPFS Gateway */}
        <div className="p-6 bg-chaos-panel border border-chaos-border rounded-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-black/40 rounded-lg">
              <Server className="w-6 h-6 text-chaos-organic" />
            </div>
            <div>
              <h3 className="text-white font-medium">IPFS Gateway</h3>
              <p className="text-xs text-chaos-muted">Asset Storage</p>
            </div>
          </div>
           <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-chaos-muted font-mono">
              <span>Gateway Response</span>
              <span className="text-white">120ms</span>
            </div>
             <div className="flex justify-between text-xs text-chaos-muted font-mono">
              <span>Pinned Objects</span>
              <span className="text-white">842</span>
            </div>
          </div>
        </div>

      </div>

      {/* Incident Log */}
      <div className="border border-chaos-border rounded-lg bg-black p-6">
        <h3 className="text-white font-medium mb-6 flex items-center gap-2">
          <Clock className="w-4 h-4 text-chaos-muted" />
          System Events Log
        </h3>
        <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-px before:bg-chaos-border">
          
          <div className="relative pl-10">
            <div className="absolute left-4 top-1.5 w-2 h-2 rounded-full bg-green-500 ring-4 ring-black"></div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
              <h4 className="text-white text-sm font-medium">All Systems Operational</h4>
              <span className="text-xs font-mono text-chaos-muted">Today, 09:00 UTC</span>
            </div>
            <p className="text-xs text-chaos-muted mt-1">Daily integrity check completed. Node consensus achieved.</p>
          </div>

           <div className="relative pl-10">
            <div className="absolute left-4 top-1.5 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-black"></div>
             <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
              <h4 className="text-white text-sm font-medium">High Gas Fees Detected</h4>
              <span className="text-xs font-mono text-chaos-muted">Yesterday, 14:30 UTC</span>
            </div>
            <p className="text-xs text-chaos-muted mt-1">Feather indexing slightly delayed due to network congestion.</p>
          </div>

           <div className="relative pl-10">
            <div className="absolute left-4 top-1.5 w-2 h-2 rounded-full bg-green-500 ring-4 ring-black"></div>
             <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
              <h4 className="text-white text-sm font-medium">System Upgrade v2.4</h4>
              <span className="text-xs font-mono text-chaos-muted">Oct 24, 2024</span>
            </div>
            <p className="text-xs text-chaos-muted mt-1">Successfully deployed new Smart Contract modules.</p>
          </div>

        </div>
      </div>

    </div>
  );
};
