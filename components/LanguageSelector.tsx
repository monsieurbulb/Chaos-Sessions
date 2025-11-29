
import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { Language } from '../types';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'zh', label: '中文' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-chaos-muted hover:text-white transition-colors rounded-full hover:bg-white/10"
        title="Change Language"
      >
        <Globe className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-chaos-panel border border-chaos-border rounded-lg shadow-xl overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-xs flex items-center justify-between hover:bg-white/5 transition-colors group"
            >
              <span className={`font-mono ${currentLanguage === lang.code ? 'text-white' : 'text-chaos-muted group-hover:text-white'}`}>
                {lang.label}
              </span>
              {currentLanguage === lang.code && <Check className="w-3 h-3 text-chaos-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
