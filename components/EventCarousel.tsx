
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Rss, Globe, Ticket } from 'lucide-react';
import { LiveEvent, Translations } from '../types';

interface EventCarouselProps {
  events: LiveEvent[];
  subscribedEventIds: string[];
  onToggleSubscription: (eventId: string) => void;
  onTicketSelection: (event: LiveEvent) => void;
  isAuthenticated: boolean;
  onConnectRequest: () => void;
  t: Translations['home'];
}

export const EventCarousel: React.FC<EventCarouselProps> = ({ 
  events, 
  subscribedEventIds, 
  onToggleSubscription, 
  onTicketSelection,
  isAuthenticated,
  onConnectRequest,
  t
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleSubscribeClick = (event: LiveEvent) => {
    if (!isAuthenticated) {
      onConnectRequest();
      return;
    }
    
    if (event.locationType === 'hybrid' || event.locationType === 'irl') {
        onTicketSelection(event);
    } else {
        onToggleSubscription(event.id);
    }
  };

  const displayEvents = events.filter(e => e.status !== 'ended');

  if (displayEvents.length === 0) return null;

  return (
    <div className="relative group animate-fade-in">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-mono text-chaos-muted uppercase tracking-widest">{t.upcoming}</h3>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 hover:bg-chaos-panel rounded-full transition-colors border border-transparent hover:border-chaos-border">
            <ChevronLeft className="w-4 h-4 text-chaos-text" />
          </button>
          <button onClick={() => scroll('right')} className="p-2 hover:bg-chaos-panel rounded-full transition-colors border border-transparent hover:border-chaos-border">
            <ChevronRight className="w-4 h-4 text-chaos-text" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 snap-x"
      >
        {displayEvents.map((event) => {
          const eventDate = new Date(event.date);
          const isLive = event.status === 'live';
          const isSubscribed = subscribedEventIds.includes(event.id);

          let LocationIcon = Globe;
          let locColor = 'text-blue-400 border-blue-400/30 bg-blue-400/10';
          let locLabel = 'Online Only';

          if (event.locationType === 'irl') {
             LocationIcon = MapPin;
             locColor = 'text-amber-500 border-amber-500/30 bg-amber-500/10';
             locLabel = 'IRL Only';
          } else if (event.locationType === 'hybrid') {
             LocationIcon = Ticket;
             locColor = 'text-purple-500 border-purple-500/30 bg-purple-500/10';
             locLabel = 'Online & IRL';
          }

          return (
            <div 
              key={event.id}
              className={`
                flex-none w-80 snap-start
                p-6 rounded-lg border transition-all duration-300
                group/card flex flex-col justify-between min-h-[220px]
                ${isSubscribed 
                  ? 'bg-chaos-organic/10 border-chaos-organic/50' 
                  : 'bg-chaos-panel/30 border-chaos-border hover:border-chaos-organic hover:bg-chaos-panel'}
              `}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-chaos-muted">
                    <Calendar className="w-3 h-3" />
                    {eventDate.toLocaleDateString()}
                  </div>
                  
                  <button 
                    onClick={() => handleSubscribeClick(event)}
                    className={`
                      p-1.5 rounded-full transition-colors
                      ${isSubscribed 
                        ? 'bg-chaos-accent text-black' 
                        : 'bg-chaos-black border border-chaos-border text-chaos-muted hover:text-chaos-text group-hover/card:border-chaos-organic'}
                    `}
                    title={isSubscribed ? "Manage Ticket" : "Get Tickets"}
                  >
                    {event.locationType === 'online' ? <Rss className="w-3 h-3" /> : <Ticket className="w-3 h-3" />}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                    {isLive ? (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-500 border border-red-500/30 rounded animate-pulse">
                        LIVE
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-chaos-accent/10 text-chaos-accent border border-chaos-accent/20 rounded">
                        UPCOMING
                      </span>
                    )}
                    
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold border rounded ${locColor}`}>
                       <LocationIcon className="w-2.5 h-2.5" />
                       {locLabel}
                    </span>
                </div>

                <h4 className="text-lg font-medium text-chaos-text leading-tight mb-2 group-hover/card:text-chaos-accent transition-colors">
                  {event.title}
                </h4>
                
                <p className="text-xs text-chaos-muted line-clamp-3 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-chaos-border/30 flex items-center justify-between text-xs text-chaos-muted font-mono">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};