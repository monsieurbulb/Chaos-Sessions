
import React, { useState } from 'react';
import { X, QrCode, MapPin, Globe, Check } from 'lucide-react';
import { LiveEvent, Ticket, Translations } from '../types';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: LiveEvent | null;
  onConfirmSelection?: (eventId: string, type: Ticket['type']) => void;
  existingTicket?: Ticket;
  viewOnly?: boolean;
}

export const TicketModal: React.FC<TicketModalProps> = ({ 
  isOpen, 
  onClose, 
  event, 
  onConfirmSelection, 
  existingTicket,
  viewOnly = false
}) => {
  const [selectedType, setSelectedType] = useState<Ticket['type'] | null>(null);

  if (!isOpen || !event) return null;

  const showQrView = viewOnly || existingTicket;

  const handleConfirm = () => {
    if (selectedType && onConfirmSelection) {
      onConfirmSelection(event.id, selectedType);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-chaos-panel border border-chaos-border rounded-xl shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-chaos-border flex justify-between items-start bg-chaos-black/50">
          <div>
             <h2 className="text-xl font-light text-chaos-text leading-tight">{event.title}</h2>
             <p className="text-xs text-chaos-muted mt-1 font-mono uppercase tracking-wider">
               {showQrView ? 'Access Pass' : 'Select Attendance'}
             </p>
          </div>
          <button onClick={onClose} className="text-chaos-muted hover:text-chaos-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {showQrView && existingTicket ? (
            /* Ticket / QR View */
            <div className="flex flex-col items-center space-y-6">
               <div className="p-4 bg-white rounded-lg border-4 border-chaos-organic/50">
                 {/* CSS Mock QR Code */}
                 <div className="w-48 h-48 bg-white grid grid-cols-12 grid-rows-12 gap-0.5">
                    {[...Array(144)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-full h-full ${Math.random() > 0.5 || 
                          (i < 36 && (i % 12 < 3 || i % 12 > 8)) || // Corner markers mockup
                          (i > 108 && i % 12 < 3) 
                          ? 'bg-black' : 'bg-transparent'}`}
                      ></div>
                    ))}
                 </div>
               </div>
               
               <div className="text-center space-y-2">
                 <div className="text-2xl font-mono text-chaos-accent tracking-widest font-bold">
                   {existingTicket.accessCode}
                 </div>
                 <div className="text-[10px] text-chaos-muted uppercase tracking-widest">
                   {existingTicket.type === 'both' ? 'All Access Pass' : `${existingTicket.type} Access`}
                 </div>
               </div>

               <div className="w-full p-3 bg-black/40 border border-chaos-border rounded text-center">
                 <p className="text-xs text-chaos-muted">
                   Present this code at the venue or use it to unlock the encrypted stream.
                 </p>
               </div>
            </div>
          ) : (
            /* Selection View */
            <div className="space-y-6">
              <p className="text-sm text-chaos-muted">
                How would you like to attend this event? Your ticket will be minted to your seed profile.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedType('online')}
                  className={`w-full p-4 rounded-lg border flex items-center justify-between transition-all ${selectedType === 'online' ? 'bg-chaos-organic/20 border-chaos-organic text-chaos-text' : 'bg-black/40 border-chaos-border text-chaos-muted hover:border-chaos-muted'}`}
                >
                   <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium text-sm">Online Only</div>
                        <div className="text-[10px] opacity-70">Stream access via Chaos Sessions</div>
                      </div>
                   </div>
                   {selectedType === 'online' && <Check className="w-4 h-4 text-chaos-organic" />}
                </button>

                <button
                  onClick={() => setSelectedType('irl')}
                  className={`w-full p-4 rounded-lg border flex items-center justify-between transition-all ${selectedType === 'irl' ? 'bg-amber-500/10 border-amber-500 text-chaos-text' : 'bg-black/40 border-chaos-border text-chaos-muted hover:border-chaos-muted'}`}
                >
                   <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium text-sm">IRL (Venue)</div>
                        <div className="text-[10px] opacity-70">Physical entry ticket</div>
                      </div>
                   </div>
                   {selectedType === 'irl' && <Check className="w-4 h-4 text-amber-500" />}
                </button>

                 <button
                  onClick={() => setSelectedType('both')}
                  className={`w-full p-4 rounded-lg border flex items-center justify-between transition-all ${selectedType === 'both' ? 'bg-purple-500/10 border-purple-500 text-chaos-text' : 'bg-black/40 border-chaos-border text-chaos-muted hover:border-chaos-muted'}`}
                >
                   <div className="flex items-center gap-3">
                      <QrCode className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium text-sm">Full Access (Hybrid)</div>
                        <div className="text-[10px] opacity-70">Venue entry + Stream access</div>
                      </div>
                   </div>
                   {selectedType === 'both' && <Check className="w-4 h-4 text-purple-500" />}
                </button>
              </div>

              <button
                disabled={!selectedType}
                onClick={handleConfirm}
                className="w-full py-3 bg-chaos-text text-chaos-black font-medium rounded hover:bg-chaos-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                Confirm Ticket
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};