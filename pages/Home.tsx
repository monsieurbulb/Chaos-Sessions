
import React, { useState, useEffect } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { Carousel } from '../components/Carousel';
import { EventCarousel } from '../components/EventCarousel';
import { TicketModal } from '../components/TicketModal';
import { User, VideoSession, LiveEvent, Ticket, Translations } from '../types';

interface HomeProps {
  user: User;
  onConnectRequest: () => void;
  videos: VideoSession[];
  events: LiveEvent[];
  onToggleSubscription: (eventId: string, ticketType?: Ticket['type']) => void;
  t: Translations['home'];
}

export const Home: React.FC<HomeProps> = ({ user, onConnectRequest, videos, events, onToggleSubscription, t }) => {
  const [currentVideo, setCurrentVideo] = useState<VideoSession>(videos[0]);
  const [ticketModalEvent, setTicketModalEvent] = useState<LiveEvent | null>(null);

  // Update current video if videos array changes (e.g. from CMS) and we are viewing the default
  useEffect(() => {
    if (videos.length > 0 && !videos.find(v => v.id === currentVideo.id)) {
        setCurrentVideo(videos[0]);
    }
  }, [videos, currentVideo.id]);

  const handleTicketSelection = (event: LiveEvent) => {
    setTicketModalEvent(event);
  };

  const handleTicketConfirm = (eventId: string, type: Ticket['type']) => {
    onToggleSubscription(eventId, type);
    setTicketModalEvent(null);
  };

  // Check if user already has a ticket for the modal event
  const existingTicket = ticketModalEvent 
    ? user.tickets.find(t => t.eventId === ticketModalEvent.id) 
    : undefined;

  return (
    <div className="animate-fade-in space-y-16">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto">
        <VideoPlayer 
          video={currentVideo} 
          isAuthenticated={user.isAuthenticated}
          onConnectRequest={onConnectRequest}
          t={t}
        />
        
        <div className="mt-6 flex flex-col md:flex-row gap-8 justify-between items-start border-b border-chaos-border pb-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-light text-chaos-text mb-2">{currentVideo.title}</h1>
            <p className="text-chaos-muted leading-relaxed font-light">{currentVideo.description}</p>
            {currentVideo.provenance && (
               <div className="mt-4 pt-4 border-t border-chaos-border/30 inline-flex flex-col gap-1">
                 <span className="text-[10px] text-chaos-organic uppercase tracking-wider font-mono">{t.provenance}</span>
                 <span className="text-[10px] text-stone-500 font-mono">CID: {currentVideo.provenance.ipfsCid}</span>
                 <span className="text-[10px] text-stone-500 font-mono">TX: {currentVideo.provenance.transactionHash.substring(0, 16)}...</span>
               </div>
            )}
          </div>
        </div>
      </section>

      {/* Events Carousel Section */}
      <section className="w-full max-w-6xl mx-auto px-4 lg:px-0">
        <EventCarousel 
          events={events} 
          subscribedEventIds={user.subscribedEvents}
          onToggleSubscription={(id) => onToggleSubscription(id)}
          onTicketSelection={handleTicketSelection}
          isAuthenticated={user.isAuthenticated}
          onConnectRequest={onConnectRequest}
          t={t}
        />
      </section>

      {/* Archives Carousel Section */}
      <section className="w-full max-w-6xl mx-auto px-4 lg:px-0">
        <Carousel 
          videos={videos} 
          onSelect={setCurrentVideo}
          selectedId={currentVideo.id}
          archiveLabel={t.archives}
        />
      </section>

      {/* Ticket Modal */}
      <TicketModal 
        isOpen={!!ticketModalEvent}
        onClose={() => setTicketModalEvent(null)}
        event={ticketModalEvent}
        onConfirmSelection={handleTicketConfirm}
        existingTicket={existingTicket}
      />
    </div>
  );
};