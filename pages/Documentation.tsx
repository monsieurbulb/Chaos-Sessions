

import React from 'react';
import { Layers, Video, Share2, Database, Shield, Hexagon, FileCode, Box, Network, Wallet, Ticket, Gem, Activity, Users, HardDrive } from 'lucide-react';

export const Documentation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="space-y-6 border-b border-chaos-border pb-8">
        <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
          <Box className="w-8 h-8 text-chaos-accent" />
          System Documentation
        </h1>
        <p className="text-chaos-muted text-lg max-w-2xl font-light">
          Technical breakdown of the Chaos Sessions decentralised media stack. 
          This architecture prioritises censorship resistance, content provenance, and user sovereignty.
        </p>
      </div>

      {/* SECTION: THE SEED ECOSYSTEM */}
      <div className="space-y-10">
        <h2 className="text-2xl font-light text-white border-l-4 border-chaos-organic pl-4 flex items-center gap-3">
          <Share2 className="w-6 h-6 text-chaos-accent" />
          The Seed Ecosystem
        </h2>
        <p className="text-sm text-chaos-muted leading-relaxed">
           The "Seed" is more than just a user profile; it is your autonomous digital twin within the Chaos network. It acts as an accumulator of reputation, assets, and relationships, represented visually as an emergent knowledge graph.
        </p>
        
        <div className="grid grid-cols-1 gap-8 mt-4">
            
            {/* 1. Identity & Visualizer */}
            <div className="p-6 bg-chaos-panel border border-chaos-border rounded-lg space-y-4">
               <div className="flex items-center gap-3 text-white border-b border-chaos-border/30 pb-3">
                   <Box className="w-5 h-5 text-chaos-accent" />
                   <h3 className="font-medium">Generative Identity Protocol</h3>
               </div>
               <p className="text-sm text-chaos-muted leading-relaxed">
                   Unlike static Web2 avatars, your Seed identity is dynamic. It is seeded by your wallet address (providing a unique deterministic fingerprint) and evolves based on your transaction history.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                   <div className="p-3 bg-black/40 rounded border border-chaos-border/30">
                       <strong className="block text-white mb-1">View 1: Transactions</strong>
                       <span className="text-chaos-muted">The raw, immutable ledger stream of every interaction you have with the network.</span>
                   </div>
                   <div className="p-3 bg-black/40 rounded border border-chaos-border/30">
                       <strong className="block text-white mb-1">View 2: Relations</strong>
                       <span className="text-chaos-muted">A force-directed graph visualizing your social distance to other nodes (peers) in the p2p mesh.</span>
                   </div>
                    <div className="p-3 bg-black/40 rounded border border-chaos-border/30">
                       <strong className="block text-white mb-1">View 3: Identity</strong>
                       <span className="text-chaos-muted">An artistic particle simulation that interprets your data as color and movement.</span>
                   </div>
               </div>
            </div>

            {/* 2. Reputation System */}
            <div className="p-6 bg-chaos-panel border border-chaos-border rounded-lg space-y-4">
               <div className="flex items-center gap-3 text-white border-b border-chaos-border/30 pb-3">
                   <Activity className="w-5 h-5 text-chaos-organic" />
                   <h3 className="font-medium">Reputation Vectors</h3>
               </div>
               <p className="text-sm text-chaos-muted leading-relaxed">
                   Trust in a distributed system must be earned, not assigned. Your Reputation Score (0-100) is a weighted aggregate of four key behaviors:
               </p>
               <ul className="space-y-3 mt-2">
                   <li className="flex gap-3 items-start text-xs text-chaos-muted">
                       <Users className="w-4 h-4 text-chaos-accent flex-shrink-0 mt-0.5" />
                       <div>
                           <strong className="text-white block">Proof of Participation (35%)</strong>
                           Verified attendance at live streams and IRL events. We use cryptographic signatures to prove you were present during the broadcast.
                       </div>
                   </li>
                   <li className="flex gap-3 items-start text-xs text-chaos-muted">
                       <HardDrive className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                       <div>
                           <strong className="text-white block">Network Health (20%)</strong>
                           Running a relay node in your browser. By sharing bandwidth and storage (via IPFS/Livepeer), you help keep the network resilient.
                       </div>
                   </li>
                    <li className="flex gap-3 items-start text-xs text-chaos-muted">
                       <Shield className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                       <div>
                           <strong className="text-white block">Sybil Resistance (20%)</strong>
                           A measure of your uniqueness. Calculated based on the age of your address and the diversity of your transaction graph.
                       </div>
                   </li>
                    <li className="flex gap-3 items-start text-xs text-chaos-muted">
                       <Feather className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                       <div>
                           <strong className="text-white block">Curation Signal (25%)</strong>
                           When you "Mint Feathers" or upvote content, and that content is validated by the community, your curation score increases.
                       </div>
                   </li>
               </ul>
            </div>

            {/* 3. Assets & Tickets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-chaos-panel border border-chaos-border rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-white border-b border-chaos-border/30 pb-2">
                        <Gem className="w-4 h-4 text-pink-400" />
                        <h3 className="font-medium">Assets (Provenance)</h3>
                    </div>
                    <p className="text-xs text-chaos-muted leading-relaxed">
                        Digital collectibles are not just JPEGs; they are <strong>Proof-of-Protocol-Participation</strong>. 
                        Assets are often minted in a "Locked" state (greyed out) and only unlock when the smart contract verifies specific on-chain conditions, such as ticket redemption or event attendance.
                    </p>
                </div>

                <div className="p-6 bg-chaos-panel border border-chaos-border rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-white border-b border-chaos-border/30 pb-2">
                        <Wallet className="w-4 h-4 text-chaos-organic" />
                        <h3 className="font-medium">Wallet Economics</h3>
                    </div>
                    <p className="text-xs text-chaos-muted leading-relaxed">
                        The wallet manages two forms of value:
                        <ul className="list-disc ml-4 mt-2 space-y-1">
                            <li><strong>dUSD:</strong> A stable unit of account for payments.</li>
                            <li><strong>Points:</strong> Non-transferable reputation tokens earned by contributing resources. Can be redeemed for access.</li>
                        </ul>
                    </p>
                </div>
            </div>

        </div>
      </div>

      <hr className="border-chaos-border opacity-50" />

      {/* Architecture Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-light text-white">Core Infrastructure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Module 1: Identity */}
            <div className="p-6 bg-chaos-panel border border-chaos-border rounded-lg space-y-4">
            <div className="flex items-center gap-3 text-white">
                <Share2 className="w-5 h-5 text-chaos-organic" />
                <h2 className="font-medium">Virto Connect (Identity)</h2>
            </div>
            <p className="text-sm text-chaos-muted leading-relaxed">
                Identity is handled via the <a href="https://demo.virto.dev/" className="text-chaos-accent hover:underline">Virto Network</a>. 
                Users connect via a non-custodial wallet. The application derives a session based on the wallet signature, allowing for an "alias" to be associated with the on-chain address.
            </p>
            <div className="text-[10px] font-mono text-stone-500 bg-black/30 p-2 rounded">
                auth_provider: "virto-connect"<br/>
                strategy: "wallet_signature"
            </div>
            </div>

            {/* Module 2: Streaming */}
            <div className="p-6 bg-chaos-panel border border-chaos-border rounded-lg space-y-4">
            <div className="flex items-center gap-3 text-white">
                <Video className="w-5 h-5 text-chaos-organic" />
                <h2 className="font-medium">Livepeer (Delivery)</h2>
            </div>
            <p className="text-sm text-chaos-muted leading-relaxed">
                Video content is ingested and transcoded via the decentralised Livepeer network. 
                The player consumes HLS streams directly from Livepeer orchestrators, bypassing centralised CDNs.
            </p>
            <div className="text-[10px] font-mono text-stone-500 bg-black/30 p-2 rounded">
                protocol: "HLS"<br/>
                network: "Livepeer Studio"
            </div>
            </div>

            {/* Module 3: Indexing */}
            <div className="p-6 bg-chaos-panel border border-chaos-border rounded-lg space-y-4">
            <div className="flex items-center gap-3 text-white">
                <Database className="w-5 h-5 text-chaos-organic" />
                <h2 className="font-medium">Feather (Data Availability)</h2>
            </div>
            <p className="text-sm text-chaos-muted leading-relaxed">
                We do not maintain a traditional backend database. Event metadata is stored as "System Remarks" on the blockchain. 
                The <a href="https://github.com/Decent-Partners/Feather-Index" className="text-chaos-accent hover:underline">Feather Indexer</a> reads these remarks to construct the application state (Upcoming events, Session archives).
            </p>
            <div className="text-[10px] font-mono text-stone-500 bg-black/30 p-2 rounded">
                indexer: "feather-v1"<br/>
                chain_event: "SYSTEM_REMARK"
            </div>
            </div>

            {/* Module 4: CMS */}
            <div className="p-6 bg-chaos-panel border border-chaos-border rounded-lg space-y-4">
            <div className="flex items-center gap-3 text-white">
                <Shield className="w-5 h-5 text-chaos-organic" />
                <h2 className="font-medium">Provenance CMS</h2>
            </div>
            <p className="text-sm text-chaos-muted leading-relaxed">
                Curators access the CMS via the Admin Terminal (footer link). 
                Publishing a "Feather" involves pinning assets to IPFS and minting the metadata to the chain. This creates a verifiable lineage for all content.
            </p>
            <div className="text-[10px] font-mono text-stone-500 bg-black/30 p-2 rounded">
                access: "admin_key"<br/>
                storage: "IPFS + Chain"
            </div>
            </div>
        </div>
      </div>

    </div>
  );
};
// Icon component helper
const Feather = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>
);