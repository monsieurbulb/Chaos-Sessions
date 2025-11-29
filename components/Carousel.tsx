
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { VideoSession } from '../types';

interface CarouselProps {
  videos: VideoSession[];
  onSelect: (video: VideoSession) => void;
  selectedId?: string;
  archiveLabel?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ videos, onSelect, selectedId, archiveLabel = "Archives" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-mono text-chaos-muted uppercase tracking-widest">{archiveLabel}</h3>
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
        {videos.map((video) => (
          <div 
            key={video.id}
            onClick={() => onSelect(video)}
            className={`
              flex-none w-72 snap-start cursor-pointer group/card
              transition-all duration-300
              ${selectedId === video.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}
            `}
          >
            <div className="relative aspect-video mb-3 overflow-hidden rounded-sm border border-chaos-border">
              <img 
                src={video.thumbnailUrl} 
                alt={video.title}
                className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/50 group-hover/card:bg-transparent transition-colors duration-300" />
              <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 w-10 h-10" />
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-chaos-accent font-mono">{video.date}</div>
              <h4 className="text-sm font-medium text-chaos-text leading-tight group-hover/card:text-chaos-accent transition-colors">
                {video.title}
              </h4>
              <p className="text-xs text-chaos-muted truncate">{video.guest}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};