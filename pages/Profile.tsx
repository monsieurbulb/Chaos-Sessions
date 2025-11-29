



import React, { useState, useRef } from 'react';
import { User, LiveEvent, ProfileViewMode, PrivacyMode, Ticket, Translations } from '../types';
import { subscribeToEvent } from '../services/mockServices';
import { Fingerprint, Rss, Calendar, Activity, Box, Share2, FileCode, Eye, EyeOff, X, ShieldCheck, HardDrive, Users, Server, Zap, Globe, Cpu, Ticket as TicketIcon, Wallet, Send, ArrowDownCircle, ArrowUpCircle, Download, CreditCard, ChevronDown, Copy, Check, Gem, Lock } from 'lucide-react';
import { GenerativeProfile } from '../components/GenerativeProfile';
import { TicketModal } from '../components/TicketModal';
import { EventDetailModal } from '../components/EventDetailModal';

interface ProfileProps {
  user: User;
  onUpdateUser: (u: User) => void;
  onConnectRequest: () => void;
  events: LiveEvent[];
  t: Translations['profile'] & { wallet: Translations['wallet'] };
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onConnectRequest, events, t }) => {
  // Visualizer State
  const [viewMode, setViewMode] = useState<ProfileViewMode>('seed');
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>('private');

  // Modal State
  const [showReputation, setShowReputation] = useState(false);
  const [showNodeStatus, setShowNodeStatus] = useState(false);
  const [showTickets, setShowTickets] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showAssets, setShowAssets] = useState(false);
  const [selectedTicketEvent, setSelectedTicketEvent] = useState<LiveEvent | null>(null);
  const [selectedEventDetail, setSelectedEventDetail] = useState<LiveEvent | null>(null);
  
  // Interactive Metric State
  const [selectedRepMetric, setSelectedRepMetric] = useState<string | null>(null);

  // Wallet Actions State
  const [walletView, setWalletView] = useState<'overview' | 'send' | 'receive'>('overview');
  const [sendAmount, setSendAmount] = useState('');
  const [sendRecipient, setSendRecipient] = useState('');
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [txnSuccess, setTxnSuccess] = useState(false);

  // Refs
  const eventsRef = useRef<HTMLDivElement>(null);

  const toggleSubscription = (eventId: string) => {
    const updatedUser = subscribeToEvent(user, eventId);
    onUpdateUser(updatedUser);
  };

  const scrollToEvents = () => {
    eventsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleTicketClick = (ticket: Ticket) => {
    const event = events.find(e => e.id === ticket.eventId);
    if (event) {
      setSelectedTicketEvent(event);
    }
  };

  const handleEventClick = (event: LiveEvent) => {
    setSelectedEventDetail(event);
  };
  
  const closeWallet = () => {
    setShowWallet(false);
    setWalletView('overview');
    setSendAmount('');
    setSendRecipient('');
    setTxnSuccess(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock send logic
    setTxnSuccess(true);
    setTimeout(() => {
        closeWallet();
        // In a real app we'd deduct balance here via callback
    }, 2000);
  };

  const selectContact = (address: string) => {
    setSendRecipient(address);
    setShowAddressBook(false);
  };

  // Filter events to only show subscribed ones
  const myEvents = events.filter(e => user.subscribedEvents.includes(e.id));

  const reputationMetrics = [
    { id: 'participation', label: 'Proof of Participation', icon: Users, color: 'text-chaos-accent', barColor: 'bg-chaos-accent', weight: '35%', desc: t.rep_participation_desc },
    { id: 'network', label: 'Network Health (Relay)', icon: HardDrive, color: 'text-blue-400', barColor: 'bg-blue-500/70', weight: '20%', desc: t.rep_network_desc },
    { id: 'sybil', label: 'Sybil Resistance', icon: ShieldCheck, color: 'text-purple-400', barColor: 'bg-purple-500/70', weight: '20%', desc: t.rep_sybil_desc },
    { id: 'curation', label: 'Curation Signal', icon: Feather, color: 'text-amber-500', barColor: 'bg-amber-500/70', weight: '25%', desc: t.rep_curation_desc },
  ];

  if (!user.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center animate-fade-in">
        <div className="p-6 bg-chaos-panel rounded-full border border-chaos-border">
          <Fingerprint className="w-12 h-12 text-chaos-muted" />
        </div>
        <h2 className="text-2xl font-light text-chaos-text">{t.identity_not_found}</h2>
        <p className="text-chaos-muted max-w-md">
          {t.identity_desc}
        </p>
        <button 
          onClick={onConnectRequest}
          className="px-8 py-3 bg-chaos-text text-chaos-black font-medium hover:bg-chaos-muted transition-colors rounded-lg"
        >
          Connect Seed
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in px-4 relative">
      
      {/* Reputation Breakdown Modal */}
      {showReputation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-chaos-panel border border-chaos-border rounded-xl shadow-2xl relative overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-chaos-border flex justify-between items-center bg-chaos-black/50">
                  <div>
                      <h3 className="text-xl font-light text-chaos-text flex items-center gap-2">
                          <Activity className="w-5 h-5 text-chaos-organic" />
                          {t.reputation} Protocol
                      </h3>
                      <p className="text-xs text-chaos-muted mt-1 font-mono">TRUST METRIC v2.4 // ADDRESS: {user.address.substring(0, 8)}...</p>
                  </div>
                  <button onClick={() => setShowReputation(false)} className="text-chaos-muted hover:text-chaos-text transition-colors">
                      <X className="w-5 h-5" />
                  </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg border border-chaos-border">
                      <span className="text-chaos-muted text-sm font-mono uppercase tracking-widest">Global Score</span>
                      <span className="text-4xl font-mono text-white font-bold">98.2</span>
                  </div>

                  <div className="space-y-5">
                      <h4 className="text-xs font-mono text-chaos-text uppercase tracking-widest border-b border-chaos-border/50 pb-2">Calculation Weights</h4>
                      
                      {reputationMetrics.map((metric) => (
                        <div 
                           key={metric.id} 
                           className="space-y-1 group cursor-pointer"
                           onClick={() => setSelectedRepMetric(selectedRepMetric === metric.id ? null : metric.id)}
                        >
                          <div className="flex justify-between text-sm text-chaos-text">
                              <span className="flex items-center gap-2">
                                <metric.icon className={`w-3 h-3 ${metric.color}`} />
                                {metric.label}
                              </span>
                              <span className={`font-mono ${metric.color}`}>{metric.weight}</span>
                          </div>
                          <div className={`h-1.5 bg-black rounded-full overflow-hidden border ${selectedRepMetric === metric.id ? 'border-chaos-organic' : 'border-chaos-border/30'} transition-colors`}>
                              <div className={`h-full ${metric.barColor} w-[${metric.weight}] group-hover:brightness-125 transition-all`}></div>
                          </div>
                          
                          {/* Expanded Detail View */}
                          {selectedRepMetric === metric.id && (
                             <div className="pt-2 pb-1 animate-fade-in">
                                <p className="text-xs text-chaos-muted bg-black/30 p-3 rounded border border-chaos-border/30 italic leading-relaxed">
                                   {metric.desc}
                                </p>
                             </div>
                          )}
                        </div>
                      ))}

                  </div>
                  
                  <div className="text-[10px] text-chaos-muted text-center pt-2">
                    Click any metric above to view calculation details.
                  </div>
              </div>
          </div>
        </div>
      )}

      {/* Node Status Modal */}
      {showNodeStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-chaos-panel border border-chaos-border rounded-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-6 border-b border-chaos-border flex justify-between items-center bg-chaos-black/50">
                  <div>
                      <h3 className="text-xl font-light text-chaos-text flex items-center gap-2">
                          <Server className="w-5 h-5 text-chaos-accent" />
                          Node Resource Monitor
                      </h3>
                      <p className="text-xs text-chaos-muted mt-1 font-mono">LOCAL CLIENT v0.9.4 // IPFS + LIVEPEER</p>
                  </div>
                  <button onClick={() => setShowNodeStatus(false)} className="text-chaos-muted hover:text-chaos-text transition-colors">
                      <X className="w-5 h-5" />
                  </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-8">
                  
                  {/* Primary Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-black/30 rounded border border-chaos-border/50 text-center">
                          <Globe className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                          <div className="text-2xl font-mono text-white">42.8 <span className="text-xs text-chaos-muted">GB</span></div>
                          <div className="text-[10px] text-chaos-muted uppercase tracking-wider mt-1">Bandwidth</div>
                      </div>
                       <div className="p-4 bg-black/30 rounded border border-chaos-border/50 text-center">
                          <Cpu className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                          <div className="text-2xl font-mono text-white">128 <span className="text-xs text-chaos-muted">Hrs</span></div>
                          <div className="text-[10px] text-chaos-muted uppercase tracking-wider mt-1">Transcoding</div>
                      </div>
                       <div className="p-4 bg-black/30 rounded border border-chaos-border/50 text-center">
                          <HardDrive className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                          <div className="text-2xl font-mono text-white">15.2 <span className="text-xs text-chaos-muted">GB</span></div>
                          <div className="text-[10px] text-chaos-muted uppercase tracking-wider mt-1">Storage</div>
                      </div>
                       <div className="p-4 bg-black/30 rounded border border-chaos-border/50 text-center">
                          <Zap className="w-5 h-5 text-chaos-organic mx-auto mb-2" />
                          <div className="text-2xl font-mono text-white">99.9 <span className="text-xs text-chaos-muted">%</span></div>
                          <div className="text-[10px] text-chaos-muted uppercase tracking-wider mt-1">Uptime</div>
                      </div>
                  </div>

                  <div className="p-4 bg-chaos-organic/10 border border-chaos-organic/30 rounded flex items-center gap-3">
                      <Globe className="w-8 h-8 text-chaos-organic p-1.5 bg-chaos-organic/20 rounded-full" />
                      <div>
                          <h4 className="text-sm font-medium text-chaos-text">Contributing to Decentralisation</h4>
                          <p className="text-xs text-chaos-muted">Your browser is actively participating to the network by sharing bandwidth and storage.</p>
                      </div>
                  </div>

              </div>
          </div>
        </div>
      )}

      {/* Ticket Wallet Modal */}
      {showTickets && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
           <div className="w-full max-w-lg bg-chaos-panel border border-chaos-border rounded-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-chaos-border flex justify-between items-center bg-chaos-black/50">
                  <div>
                      <h3 className="text-xl font-light text-chaos-text flex items-center gap-2">
                          <TicketIcon className="w-5 h-5 text-purple-500" />
                          Event Wallet
                      </h3>
                      <p className="text-xs text-chaos-muted mt-1 font-mono">ACCESS PASSES // {user.tickets.length} VALID</p>
                  </div>
                  <button onClick={() => setShowTickets(false)} className="text-chaos-muted hover:text-chaos-text transition-colors">
                      <X className="w-5 h-5" />
                  </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4">
                 {user.tickets.length === 0 ? (
                   <div className="text-center py-12 text-chaos-muted">
                     <TicketIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>No active tickets found.</p>
                   </div>
                 ) : (
                   user.tickets.map(ticket => {
                      const eventName = events.find(e => e.id === ticket.eventId)?.title || 'Unknown Event';
                      return (
                        <div 
                           key={ticket.eventId} 
                           onClick={() => handleTicketClick(ticket)}
                           className="p-4 bg-black/40 border border-chaos-border hover:border-purple-500/50 rounded-lg cursor-pointer transition-all flex justify-between items-center group"
                        >
                           <div>
                              <div className="text-xs font-mono text-purple-400 mb-1">{ticket.type === 'both' ? 'HYBRID ACCESS' : `${ticket.type} ONLY`.toUpperCase()}</div>
                              <h4 className="text-white font-medium">{eventName}</h4>
                              <p className="text-[10px] text-chaos-muted font-mono mt-1">{ticket.accessCode}</p>
                           </div>
                           <div className="p-2 bg-white rounded group-hover:scale-105 transition-transform">
                              <Box className="w-6 h-6 text-black" />
                           </div>
                        </div>
                      )
                   })
                 )}
              </div>
           </div>
         </div>
      )}

      {/* Assets (NFT) Modal */}
      {showAssets && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
           <div className="w-full max-w-2xl bg-chaos-panel border border-chaos-border rounded-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-chaos-border flex justify-between items-center bg-chaos-black/50">
                  <div>
                      <h3 className="text-xl font-light text-chaos-text flex items-center gap-2">
                          <Gem className="w-5 h-5 text-pink-400" />
                          {t.digital_collectibles}
                      </h3>
                      <p className="text-xs text-chaos-muted mt-1 font-mono">ASSET REGISTRY // {user.assets.length} ITEMS</p>
                  </div>
                  <button onClick={() => setShowAssets(false)} className="text-chaos-muted hover:text-chaos-text transition-colors">
                      <X className="w-5 h-5" />
                  </button>
              </div>
              <div className="p-6 overflow-y-auto">
                 {user.assets.length === 0 ? (
                   <div className="text-center py-16 text-chaos-muted">
                     <Gem className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>No collectibles found.</p>
                     <p className="text-xs mt-2">Attend events to earn unique assets.</p>
                   </div>
                 ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {user.assets.map(asset => (
                            <div key={asset.id} className="relative group bg-black border border-chaos-border rounded-xl overflow-hidden">
                                <div className="aspect-square relative overflow-hidden">
                                    <img 
                                        src={asset.imageUrl} 
                                        alt={asset.title}
                                        className={`w-full h-full object-cover transition-all duration-500 ${asset.status === 'locked' ? 'grayscale opacity-50 blur-[2px]' : 'hover:scale-105'}`} 
                                    />
                                    {asset.status === 'locked' && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                                            <div className="p-3 bg-black/80 rounded-full border border-chaos-border mb-2">
                                                <Lock className="w-6 h-6 text-chaos-muted" />
                                            </div>
                                            <span className="px-3 py-1 bg-black/80 text-white text-[10px] font-mono uppercase tracking-widest border border-chaos-border rounded-full">
                                                {t.locked}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h4 className="text-white font-medium mb-1 truncate">{asset.title}</h4>
                                    <p className="text-xs text-chaos-muted line-clamp-2 mb-3">{asset.description}</p>
                                    <div className="flex justify-between items-center text-[10px] font-mono border-t border-chaos-border/30 pt-3">
                                        <span className="text-pink-400">ERC-721</span>
                                        <span className="text-stone-500">{asset.tokenId}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 )}
              </div>
           </div>
         </div>
      )}

      {/* Wallet Modal */}
      {showWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-chaos-panel border border-chaos-border rounded-xl shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-chaos-border flex justify-between items-center bg-chaos-black/50">
              <div className="flex items-center gap-3">
                 {walletView !== 'overview' && (
                   <button onClick={() => setWalletView('overview')} className="p-1 hover:bg-white/10 rounded">
                     <ArrowUpCircle className="w-5 h-5 text-white rotate-[-90deg]" />
                   </button>
                 )}
                 <div>
                    <h3 className="text-xl font-light text-chaos-text flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-chaos-accent" />
                      {walletView === 'send' ? t.wallet.send : walletView === 'receive' ? t.wallet.receive : t.wallet.title}
                    </h3>
                    <p className="text-xs text-chaos-muted mt-1 font-mono">ACCOUNT // {user.address.substring(0, 12)}...</p>
                 </div>
              </div>
              <button onClick={closeWallet} className="text-chaos-muted hover:text-chaos-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* OVERVIEW VIEW */}
              {walletView === 'overview' && (
                <>
                  <div className="grid grid-cols-2 gap-4 pb-6 border-b border-chaos-border">
                    <div className="text-center p-4 bg-black/30 rounded-lg">
                       <div className="text-xs text-chaos-muted uppercase tracking-widest mb-2">{t.balance}</div>
                       <div className="text-3xl font-mono text-white font-medium flex items-center justify-center gap-1">
                          {user.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                       </div>
                    </div>
                    <div className="text-center p-4 bg-chaos-organic/10 rounded-lg border border-chaos-organic/20">
                       <div className="text-xs text-chaos-organic uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
                          <Zap className="w-3 h-3" /> Network Points
                       </div>
                       <div className="text-3xl font-mono text-white font-medium">
                          {user.points?.toLocaleString() || '0'}
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                     <button onClick={() => setWalletView('send')} className="flex flex-col items-center gap-2 group">
                        <div className="p-4 bg-chaos-organic/20 rounded-full border border-chaos-organic group-hover:bg-chaos-organic group-hover:text-white transition-all text-chaos-accent">
                           <Send className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-chaos-muted group-hover:text-chaos-text transition-colors">{t.wallet.send}</span>
                     </button>
                     <button onClick={() => setWalletView('receive')} className="flex flex-col items-center gap-2 group">
                        <div className="p-4 bg-chaos-black rounded-full border border-chaos-border group-hover:border-chaos-accent group-hover:text-chaos-text transition-all text-chaos-muted">
                           <Download className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-chaos-muted group-hover:text-chaos-text transition-colors">{t.wallet.receive}</span>
                     </button>
                     <button className="flex flex-col items-center gap-2 group">
                        <div className="p-4 bg-chaos-black rounded-full border border-chaos-border group-hover:border-chaos-accent group-hover:text-chaos-text transition-all text-chaos-muted">
                           <ArrowDownCircle className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-chaos-muted group-hover:text-chaos-text transition-colors">{t.wallet.deposit}</span>
                     </button>
                     <button className="flex flex-col items-center gap-2 group">
                        <div className="p-4 bg-chaos-black rounded-full border border-chaos-border group-hover:border-chaos-accent group-hover:text-chaos-text transition-all text-chaos-muted">
                           <ArrowUpCircle className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-chaos-muted group-hover:text-chaos-text transition-colors">{t.wallet.withdraw}</span>
                     </button>
                  </div>

                  <div className="p-4 bg-chaos-panel border border-chaos-border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                       <h4 className="text-sm text-chaos-text font-medium flex items-center gap-2">
                         <Zap className="w-4 h-4 text-chaos-organic" />
                         {t.wallet.redeem}
                       </h4>
                       <button className="text-[10px] bg-chaos-text text-chaos-black font-medium px-3 py-1 rounded hover:bg-chaos-muted transition-colors">
                         Redeem
                       </button>
                    </div>
                    <p className="text-xs text-chaos-muted leading-relaxed">
                      {t.wallet.points_desc}
                    </p>
                  </div>
                </>
              )}

              {/* SEND VIEW */}
              {walletView === 'send' && (
                 <form onSubmit={handleSend} className="space-y-6">
                    {txnSuccess ? (
                        <div className="py-12 flex flex-col items-center text-center animate-fade-in">
                            <div className="p-4 rounded-full bg-green-500/20 text-green-500 mb-4">
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="text-chaos-text text-lg font-medium">Transaction Sent</h3>
                            <p className="text-chaos-muted text-sm mt-2">Your funds are being processed by the network.</p>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-xs font-mono text-chaos-muted mb-2">AMOUNT (dUSD)</label>
                                <input 
                                    type="number" 
                                    autoFocus
                                    className="w-full bg-black/50 border border-chaos-border text-white p-3 rounded text-lg font-mono focus:border-chaos-accent focus:outline-none"
                                    placeholder="0.00"
                                    value={sendAmount}
                                    onChange={e => setSendAmount(e.target.value)}
                                />
                                <div className="text-right mt-1 text-[10px] text-chaos-muted">
                                    Available: {user.balance?.toFixed(2)} dUSD
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-xs font-mono text-chaos-muted mb-2">RECIPIENT ADDRESS</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        className="flex-1 bg-black/50 border border-chaos-border text-white p-3 rounded font-mono text-sm focus:border-chaos-accent focus:outline-none"
                                        placeholder="0x..."
                                        value={sendRecipient}
                                        onChange={e => setSendRecipient(e.target.value)}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowAddressBook(!showAddressBook)}
                                        className="px-4 bg-chaos-panel border border-chaos-border text-chaos-muted hover:text-chaos-text rounded transition-colors"
                                    >
                                        <Users className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Dropdown Address Book */}
                                {showAddressBook && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-chaos-panel border border-chaos-border rounded shadow-xl z-20 max-h-48 overflow-y-auto">
                                        <div className="p-2 text-[10px] text-chaos-muted uppercase tracking-widest border-b border-chaos-border/50">Address Book</div>
                                        {user.addressBook.map((contact, i) => (
                                            <button 
                                                key={i}
                                                type="button"
                                                onClick={() => selectContact(contact.address)}
                                                className="w-full text-left p-3 hover:bg-white/5 flex items-center justify-between group"
                                            >
                                                <div>
                                                    <div className="text-sm text-chaos-text font-medium">{contact.alias}</div>
                                                    <div className="text-xs text-chaos-muted font-mono">{contact.address}</div>
                                                </div>
                                                <ChevronDown className="w-4 h-4 text-chaos-muted opacity-0 group-hover:opacity-100 -rotate-90" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-4 bg-chaos-accent text-black font-medium uppercase tracking-widest hover:bg-white transition-colors rounded"
                            >
                                Confirm Transfer
                            </button>
                        </>
                    )}
                 </form>
              )}

              {/* RECEIVE VIEW */}
              {walletView === 'receive' && (
                  <div className="flex flex-col items-center space-y-6 py-4">
                      <div className="p-4 bg-white rounded border-4 border-chaos-organic/30">
                          {/* Mock QR */}
                          <div className="w-48 h-48 bg-white grid grid-cols-12 grid-rows-12 gap-0.5">
                                {[...Array(144)].map((_, i) => (
                                <div key={i} className={`w-full h-full ${(i % 2 === 0 && Math.random() > 0.3) ? 'bg-black' : 'bg-transparent'}`}></div>
                                ))}
                           </div>
                      </div>
                      
                      <div className="w-full">
                          <label className="block text-center text-[10px] font-mono text-chaos-muted mb-2 uppercase tracking-widest">Your Deposit Address</label>
                          <div className="flex items-center gap-2 p-3 bg-black/50 border border-chaos-border rounded">
                              <code className="flex-1 text-xs text-white font-mono break-all text-center">
                                  {user.address}
                              </code>
                              <button className="p-2 hover:bg-white/10 rounded text-chaos-accent transition-colors" title="Copy">
                                  <Copy className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* HERO: Generative Identity Visualizer */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
        
        {/* Left: Controls & Metadata */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-chaos-panel border border-chaos-border p-6 rounded-xl h-full shadow-lg">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-chaos-organic/20 rounded-md">
                  <Fingerprint className="w-6 h-6 text-chaos-accent" />
               </div>
               <div>
                 <h3 className="text-base font-medium text-chaos-text uppercase tracking-wider">{user.alias || 'User'}</h3>
                 <p className="text-[10px] text-chaos-muted font-mono">{user.address.substring(0, 16)}...</p>
               </div>
            </div>

            {/* Moved Stats Section */}
            <div className="space-y-2">
                <button 
                  onClick={scrollToEvents}
                  className="w-full flex justify-between items-center p-3 bg-black/30 border border-chaos-border rounded hover:border-chaos-text transition-colors group"
                >
                  <div className="flex items-center gap-2">
                     <Rss className="w-4 h-4 text-chaos-muted group-hover:text-chaos-text" />
                     <span className="text-xs text-chaos-muted group-hover:text-chaos-text">{t.subscriptions}</span>
                  </div>
                  <span className="text-sm font-mono text-chaos-text">{user.subscribedEvents.length}</span>
                </button>

                <button 
                  onClick={() => setShowTickets(true)}
                  className="w-full flex justify-between items-center p-3 bg-black/30 border border-chaos-border rounded hover:border-purple-500 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                     <TicketIcon className="w-4 h-4 text-chaos-muted group-hover:text-purple-400" />
                     <span className="text-xs text-chaos-muted group-hover:text-chaos-text">{t.tickets}</span>
                  </div>
                  <span className="text-sm font-mono text-purple-400">{user.tickets.length}</span>
                </button>

                <button 
                  onClick={() => setShowAssets(true)}
                  className="w-full flex justify-between items-center p-3 bg-black/30 border border-chaos-border rounded hover:border-pink-500 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                     <Gem className="w-4 h-4 text-chaos-muted group-hover:text-pink-400" />
                     <span className="text-xs text-chaos-muted group-hover:text-chaos-text">{t.assets}</span>
                  </div>
                  <span className="text-sm font-mono text-pink-400">{user.assets.length}</span>
                </button>

                <button 
                  onClick={() => setShowWallet(true)}
                  className="w-full flex justify-between items-center p-3 bg-black/30 border border-chaos-border rounded hover:border-chaos-accent transition-colors group"
                >
                  <div className="flex items-center gap-2">
                     <Wallet className="w-4 h-4 text-chaos-muted group-hover:text-chaos-accent" />
                     <span className="text-xs text-chaos-muted group-hover:text-chaos-text">{t.balance}</span>
                  </div>
                  <span className="text-sm font-mono text-chaos-accent">{user.balance?.toFixed(0)} dUSD</span>
                </button>

                <button 
                  onClick={() => setShowReputation(true)}
                  className="w-full flex justify-between items-center p-3 bg-black/30 border border-chaos-border rounded hover:border-chaos-text transition-colors group"
                >
                  <div className="flex items-center gap-2">
                     <Activity className="w-4 h-4 text-chaos-muted group-hover:text-chaos-text" />
                     <span className="text-xs text-chaos-muted group-hover:text-chaos-text">{t.reputation}</span>
                  </div>
                  <span className="text-sm font-mono text-chaos-text">98.2</span>
                </button>

                 <button 
                  onClick={() => setShowNodeStatus(true)}
                  className="w-full flex justify-between items-center p-3 bg-black/30 border border-chaos-border rounded hover:border-chaos-accent transition-colors group"
                >
                  <div className="flex items-center gap-2">
                     <Server className="w-4 h-4 text-chaos-muted group-hover:text-chaos-accent" />
                     <span className="text-xs text-chaos-muted group-hover:text-chaos-text">{t.node_status}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-mono text-white">Active</span>
                  </div>
                </button>
            </div>

            {/* UPCOMING EVENTS LIST (Moved to Sidebar) */}
            <div ref={eventsRef} className="space-y-3 py-4 border-t border-chaos-border/50">
               <h3 className="text-xs font-bold text-chaos-text uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Activity className="w-3 h-3 text-chaos-organic" />
                  {t.upcoming_header}
               </h3>
               {myEvents.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-6 text-chaos-muted bg-black/20 rounded border border-dashed border-chaos-border">
                    <Rss className="w-5 h-5 mb-2 opacity-30" />
                    <span className="text-[10px]">{t.no_subs}</span>
                 </div>
               ) : (
                 <div className="space-y-3 max-h-[250px] overflow-y-auto scrollbar-hide">
                    {myEvents.map(event => (
                       <button 
                          key={event.id} 
                          onClick={() => handleEventClick(event)}
                          className="w-full text-left p-3 bg-black/40 border border-chaos-border rounded hover:border-chaos-organic/50 transition-colors group cursor-pointer"
                       >
                          <div className="flex justify-between items-start mb-1">
                             <div className="flex flex-col">
                                <span className="text-xs font-medium text-white group-hover:text-chaos-accent transition-colors truncate max-w-[150px]">{event.title}</span>
                                <span className="text-[10px] text-chaos-muted font-mono">{new Date(event.date).toLocaleDateString()}</span>
                             </div>
                             <div 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSubscription(event.id);
                                }} 
                                className="text-chaos-muted hover:text-white p-1 rounded hover:bg-white/10" 
                                title="Unsubscribe"
                             >
                                <X className="w-3 h-3" />
                             </div>
                          </div>
                          <p className="text-[10px] text-chaos-muted line-clamp-2 leading-relaxed">{event.description}</p>
                       </button>
                    ))}
                 </div>
               )}
            </div>

            <div className="space-y-6 pt-6 border-t border-chaos-border/50">
               <div>
                  <label className="text-xs text-chaos-muted uppercase tracking-widest mb-3 block">{t.perspective}</label>
                  <div className="grid grid-cols-2 gap-2 bg-black/50 p-1 rounded-lg border border-chaos-border">
                    <button 
                      onClick={() => setPrivacyMode('private')}
                      className={`flex items-center justify-center gap-2 py-2 text-xs rounded transition-colors ${privacyMode === 'private' ? 'bg-chaos-organic text-white' : 'text-chaos-muted hover:text-chaos-text'}`}
                    >
                      <EyeOff className="w-3 h-3" />
                      {t.private}
                    </button>
                    <button 
                      onClick={() => setPrivacyMode('public')}
                      className={`flex items-center justify-center gap-2 py-2 text-xs rounded transition-colors ${privacyMode === 'public' ? 'bg-chaos-organic text-white' : 'text-chaos-muted hover:text-chaos-text'}`}
                    >
                      <Eye className="w-3 h-3" />
                      {t.public}
                    </button>
                  </div>
               </div>

               <div>
                  <label className="text-xs text-chaos-muted uppercase tracking-widest mb-3 block">{t.data_layer}</label>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setViewMode('transactions')}
                      className={`w-full text-left px-4 py-3 rounded border transition-all flex items-center gap-3 ${viewMode === 'transactions' ? 'bg-chaos-black border-chaos-accent text-chaos-text' : 'bg-transparent border-chaos-border text-chaos-muted hover:border-chaos-organic'}`}
                    >
                      <FileCode className="w-4 h-4" />
                      <div className="flex-1">
                        <span className="block text-xs font-bold">{t.transactions}</span>
                        <span className="block text-[10px] opacity-70">Raw Ledger Stream</span>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setViewMode('relations')}
                      className={`w-full text-left px-4 py-3 rounded border transition-all flex items-center gap-3 ${viewMode === 'relations' ? 'bg-chaos-black border-chaos-accent text-chaos-text' : 'bg-transparent border-chaos-border text-chaos-muted hover:border-chaos-organic'}`}
                    >
                      <Share2 className="w-4 h-4" />
                      <div className="flex-1">
                        <span className="block text-xs font-bold">{t.relations}</span>
                        <span className="block text-[10px] opacity-70">Spatial Graph</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => setViewMode('seed')}
                      className={`w-full text-left px-4 py-3 rounded border transition-all flex items-center gap-3 ${viewMode === 'seed' ? 'bg-chaos-black border-chaos-accent text-chaos-text' : 'bg-transparent border-chaos-border text-chaos-muted hover:border-chaos-organic'}`}
                    >
                      <Box className="w-4 h-4" />
                      <div className="flex-1">
                        <span className="block text-xs font-bold">{t.identity}</span>
                        <span className="block text-[10px] opacity-70">Generative Visual</span>
                      </div>
                    </button>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-chaos-border/50 text-[10px] text-chaos-muted font-mono">
             ID: {user.address}
          </div>
        </div>

        {/* Right: The Visualizer */}
        <div className="lg:col-span-9 h-full bg-black rounded-xl border border-chaos-border overflow-hidden relative group min-h-[600px] shadow-2xl shadow-black/50">
          <GenerativeProfile 
            user={user}
            viewMode={viewMode}
            privacyMode={privacyMode}
          />
          {/* Subtle corner aesthetic */}
          <div className="absolute bottom-6 right-6 pointer-events-none">
             <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-chaos-accent rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-mono text-chaos-accent uppercase tracking-widest opacity-70">Live Rendering</span>
             </div>
          </div>
        </div>
      </section>

      {/* Shared Ticket Modal for Viewing */}
      <TicketModal 
        isOpen={!!selectedTicketEvent}
        onClose={() => setSelectedTicketEvent(null)}
        event={selectedTicketEvent}
        existingTicket={selectedTicketEvent ? user.tickets.find(t => t.eventId === selectedTicketEvent.id) : undefined}
        viewOnly={true}
      />

      {/* Event Detail Modal (New) */}
      <EventDetailModal
        isOpen={!!selectedEventDetail}
        onClose={() => setSelectedEventDetail(null)}
        event={selectedEventDetail}
        ticket={selectedEventDetail ? user.tickets.find(t => t.eventId === selectedEventDetail.id) : undefined}
        assets={selectedEventDetail ? user.assets.filter(a => a.eventId === selectedEventDetail.id) : []}
        onViewTicket={(ticket) => handleTicketClick(ticket)}
        t={t}
      />

    </div>
  );
};
// Icon component helper
const Feather = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>
);