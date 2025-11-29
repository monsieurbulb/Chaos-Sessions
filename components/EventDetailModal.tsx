
import React, { useState } from 'react';
import { X, Calendar, MapPin, Ticket, Gem, Lock, Globe, Box, ShieldCheck, ChevronLeft } from 'lucide-react';
import { LiveEvent, Ticket as TicketType, Asset, Translations } from '../types';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: LiveEvent | null;
  ticket?: TicketType;
  assets: Asset[];
  onViewTicket: (ticket: TicketType) => void;
  t: Translations['profile'];
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  event, 
  ticket, 
  assets, 
  onViewTicket,
  t 
}) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-chaos-panel border border-chaos-border rounded-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* ASSET TEASER OVERLAY */}
        {selectedAsset && (
            <div className="absolute inset-0 z-20 bg-chaos-panel flex flex-col animate-fade-in">
                <div className="p-6 border-b border-chaos-border flex justify-between items-center bg-chaos-black/50">
                    <button 
                        onClick={() => setSelectedAsset(null)} 
                        className="flex items-center gap-2 text-chaos-muted hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">{t.event_package}</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-chaos-accent uppercase tracking-wider">{t.asset_teaser}</span>
                        <Gem className="w-4 h-4 text-pink-400" />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-chaos-border">
                         <img 
                            src={selectedAsset.imageUrl} 
                            alt={selectedAsset.title}
                            className={`w-full h-full object-cover ${selectedAsset.status === 'locked' ? 'grayscale blur-sm opacity-50' : ''}`}
                        />
                        {selectedAsset.status === 'locked' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                                <div className="p-4 bg-black/80 rounded-full border border-chaos-border mb-3">
                                    <Lock className="w-8 h-8 text-chaos-muted" />
                                </div>
                                <span className="px-4 py-1 bg-black/80 text-white text-xs font-mono uppercase tracking-widest border border-chaos-border rounded-full">
                                    {t.locked}
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-xl font-light text-white mb-2">{selectedAsset.title}</h3>
                        <p className="text-sm text-chaos-muted leading-relaxed">{selectedAsset.description}</p>
                    </div>

                    <div className="p-4 bg-black/40 border border-chaos-border rounded-lg">
                        <h4 className="text-xs font-bold text-chaos-text uppercase tracking-widest mb-3 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-chaos-organic" />
                            {t.unlock_condition}
                        </h4>
                        <p className="text-sm text-chaos-muted italic">
                            "{t.how_to_unlock}"
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* HERO IMAGE BANNER */}
        {event.imageUrl && (
            <div className="relative w-full h-48 sm:h-64 flex-shrink-0 bg-chaos-black">
                <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chaos-panel via-transparent to-transparent opacity-90"></div>
            </div>
        )}

        {/* Header */}
        <div className={`px-6 pb-6 border-b border-chaos-border flex justify-between items-start bg-chaos-black/50 ${event.imageUrl ? 'pt-2 -mt-12 relative z-10 bg-transparent border-none' : 'pt-6'}`}>
          <div className={`${event.imageUrl ? 'drop-shadow-lg' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                    event.locationType === 'irl' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' :
                    event.locationType === 'hybrid' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/30' :
                    'bg-blue-400/10 text-blue-400 border border-blue-400/30'
                } ${event.imageUrl ? 'bg-black/80 backdrop-blur-md' : ''}`}>
                    {event.locationType === 'hybrid' ? 'Hybrid Event' : event.locationType === 'irl' ? 'IRL Only' : 'Online Stream'}
                </span>
                {event.status === 'live' && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-500/10 text-red-500 border border-red-500/30 animate-pulse">
                        LIVE NOW
                    </span>
                )}
            </div>
            <h2 className="text-2xl font-light text-chaos-text leading-tight">{event.title}</h2>
            <div className="flex items-center gap-4 mt-2 text-xs text-chaos-muted font-mono">
                <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(event.date).toLocaleDateString()}
                </span>
                 <span className="flex items-center gap-1">
                    {event.locationType === 'online' ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                    {new Date(event.date).toLocaleTimeString()} UTC
                </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`text-chaos-muted hover:text-chaos-text p-2 rounded-full transition-colors ${event.imageUrl ? 'bg-black/50 hover:bg-black/80 text-white' : 'hover:bg-white/10'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Description */}
            <div className="prose prose-invert max-w-none">
                <p className="text-sm text-chaos-muted leading-relaxed">
                    {event.description}
                </p>
            </div>

            {/* Event Package Section */}
            <div>
                <h3 className="text-sm font-medium text-white flex items-center gap-2 mb-4 border-b border-chaos-border/50 pb-2">
                    <Box className="w-4 h-4 text-chaos-organic" />
                    {t.event_package}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Ticket Status */}
                    <div className="p-4 bg-black/40 border border-chaos-border rounded-lg flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Ticket className="w-4 h-4 text-purple-400" />
                                <span className="text-xs font-bold text-chaos-text uppercase tracking-wider">{t.your_ticket}</span>
                            </div>
                            {ticket ? (
                                <div className="space-y-1">
                                    <div className="text-sm text-white font-medium">{ticket.type === 'both' ? 'Hybrid Pass' : `${ticket.type} Access`.toUpperCase()}</div>
                                    <div className="text-[10px] text-chaos-muted font-mono">{ticket.accessCode}</div>
                                </div>
                            ) : (
                                <p className="text-xs text-chaos-muted italic">No active ticket found for this event.</p>
                            )}
                        </div>
                        
                        {ticket && (
                            <button 
                                onClick={() => onViewTicket(ticket)}
                                className="mt-4 w-full py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs hover:bg-purple-500/20 transition-colors rounded"
                            >
                                {t.view_ticket}
                            </button>
                        )}
                    </div>

                    {/* Associated Assets */}
                    <div className="p-4 bg-black/40 border border-chaos-border rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <Gem className="w-4 h-4 text-pink-400" />
                            <span className="text-xs font-bold text-chaos-text uppercase tracking-wider">{t.related_assets}</span>
                        </div>
                        
                        {assets.length > 0 ? (
                            <div className="space-y-3">
                                {assets.map(asset => (
                                    <div 
                                        key={asset.id} 
                                        onClick={() => setSelectedAsset(asset)}
                                        className="flex gap-3 items-center group cursor-pointer p-2 -mx-2 rounded hover:bg-white/5 transition-colors"
                                    >
                                        <div className="relative w-12 h-12 rounded overflow-hidden border border-chaos-border group-hover:border-pink-400/50 transition-colors">
                                            <img 
                                                src={asset.imageUrl} 
                                                alt={asset.title}
                                                className={`w-full h-full object-cover ${asset.status === 'locked' ? 'grayscale blur-[1px] opacity-50' : ''}`}
                                            />
                                            {asset.status === 'locked' && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                    <Lock className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-white truncate group-hover:text-pink-400 transition-colors">{asset.title}</div>
                                            <div className="text-[10px] text-chaos-muted truncate">
                                                {asset.status === 'locked' ? t.locked : `Token ID: ${asset.tokenId}`}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-chaos-muted italic">No digital collectibles available for this event.</p>
                        )}
                    </div>

                </div>
            </div>

            {/* Technical Metadata */}
            <div className="pt-4 border-t border-chaos-border/30">
                <div className="flex items-center gap-2 text-[10px] text-chaos-muted font-mono">
                    <span className="uppercase">Event ID:</span>
                    <span className="text-stone-500">{event.id}</span>
                    {event.ipfsHash && (
                        <>
                            <span className="mx-2">|</span>
                            <span className="uppercase">IPFS:</span>
                            <span className="text-stone-500 truncate max-w-[150px]">{event.ipfsHash}</span>
                        </>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
