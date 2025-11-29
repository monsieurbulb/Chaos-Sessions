import React from 'react';
import { X, ShieldCheck, Wallet } from 'lucide-react';
import { Translations } from '../types';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
  isConnecting: boolean;
  t: Translations['auth'];
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, onConnect, isConnecting, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-chaos-panel border border-chaos-border rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-chaos-border">
          <h2 className="text-xl font-semibold text-chaos-text flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-chaos-accent" />
            {t.title}
          </h2>
          <button onClick={onClose} className="text-chaos-muted hover:text-chaos-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-chaos-muted leading-relaxed">
            {t.description}
          </p>

          <div className="space-y-3">
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="w-full group flex items-center justify-between p-4 bg-chaos-black border border-chaos-border hover:border-chaos-accent hover:bg-chaos-dark rounded-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-chaos-organic/20 flex items-center justify-center group-hover:bg-chaos-organic/40 transition-colors">
                  <Wallet className="w-5 h-5 text-chaos-accent" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-chaos-text">{t.browser_wallet}</div>
                  <div className="text-xs text-chaos-muted">Metamask, Rabin, etc.</div>
                </div>
              </div>
              {isConnecting && (
                <div className="w-4 h-4 border-2 border-chaos-accent border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>
            
             <button
              disabled
              className="w-full flex items-center justify-between p-4 bg-chaos-black border border-chaos-border opacity-50 cursor-not-allowed rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center">
                  <span className="font-mono text-xs text-stone-400">QR</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-stone-400">{t.wallet_connect}</div>
                  <div className="text-xs text-stone-600">Scan via mobile</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-chaos-black border-t border-chaos-border text-center">
          <a 
            href="https://demo.virto.dev/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-chaos-organic hover:text-chaos-accent transition-colors"
          >
            {t.learn_more}
          </a>
        </div>
      </div>
    </div>
  );
};