
import React, { useState, useRef } from 'react';
import { Play, Lock, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { VideoSession, Translations } from '../types';

interface VideoPlayerProps {
  video: VideoSession | null;
  isAuthenticated: boolean;
  onConnectRequest: () => void;
  t: Translations['home'];
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isAuthenticated, onConnectRequest, t }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error("Error enabling fullscreen:", err);
        });
        setIsPlaying(true); // Auto-play when entering fullscreen
      } else {
        document.exitFullscreen();
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  if (!video) {
    return (
      <div className="w-full aspect-video bg-chaos-black border border-chaos-border rounded-lg flex items-center justify-center">
        <p className="text-chaos-muted">{t.select_session}</p>
      </div>
    );
  }

  // If not authenticated, show lock screen
  if (!isAuthenticated) {
    return (
      <div className="relative w-full aspect-video bg-chaos-black border border-chaos-border rounded-lg overflow-hidden group">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover opacity-20 grayscale transition-opacity duration-700 group-hover:opacity-30" 
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="p-4 rounded-full bg-chaos-panel border border-chaos-border backdrop-blur-md">
            <Lock className="w-8 h-8 text-chaos-accent" />
          </div>
          <div className="text-center px-4">
            <h3 className="text-xl font-light text-chaos-text mb-2">{t.restricted}</h3>
            <p className="text-sm text-chaos-muted mb-6">{t.restricted_desc}</p>
            <button 
              onClick={onConnectRequest}
              className="px-6 py-2 bg-chaos-organic/20 hover:bg-chaos-organic/40 border border-chaos-organic text-chaos-accent rounded-full text-sm transition-all tracking-wide uppercase"
            >
              {t.connect_seed}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-black border border-chaos-border rounded-lg overflow-hidden shadow-2xl">
      {isPlaying ? (
        <video 
          src={video.videoUrl} 
          controls 
          autoPlay 
          muted={isMuted}
          className="w-full h-full object-contain"
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="relative w-full h-full">
           <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="w-full h-full object-cover opacity-60 grayscale" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chaos-black via-transparent to-transparent opacity-90" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={() => setIsPlaying(true)}
              className="group relative flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:scale-110 transition-transform duration-300"
            >
              <Play className="w-8 h-8 text-white fill-current ml-1" />
              <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse-slow"></div>
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-end justify-between">
              <div>
                <span className="inline-block px-2 py-1 mb-3 text-xs font-mono text-chaos-accent bg-chaos-organic/10 border border-chaos-organic/30 rounded">
                  LIVEPEER NETWORK
                </span>
                <h2 className="text-3xl font-light text-white mb-2 tracking-tight">{video.title}</h2>
                <p className="text-chaos-muted text-lg font-light flex items-center gap-2">
                  with <span className="text-white border-b border-chaos-organic pb-0.5">{video.guest}</span>
                </p>
              </div>
              <div className="flex gap-4 text-chaos-muted">
                <button onClick={toggleMute} className="hover:text-white transition-colors">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button onClick={toggleFullscreen} className="hover:text-white transition-colors">
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};