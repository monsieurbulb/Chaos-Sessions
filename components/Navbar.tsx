
import React from 'react';
import { ViewMode, User, Language, Theme, Translations } from '../types';
import { Zap, Menu, BookOpen, User as UserIcon, Sun, Moon } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  user: User;
  onConnectRequest: () => void;
  onLogout: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  t: Translations['nav'];
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onChangeView, 
  user, 
  onConnectRequest, 
  onLogout,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  t
}) => {

  return (
    <nav className="sticky top-0 z-40 w-full bg-chaos-black/90 backdrop-blur-md border-b border-chaos-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <button 
          onClick={() => onChangeView('home')}
          className="flex items-center gap-3 group"
        >
          <div className="relative w-10 h-10 flex-shrink-0">
             <svg viewBox="0 0 100 100" className="w-full h-full transform transition-transform group-hover:scale-105 duration-500">
               {/* Abstract Network/Organic CS Logo */}
               <path 
                 d="M70 25 C 40 15, 20 35, 25 55 C 30 75, 50 80, 75 75" 
                 fill="none" 
                 stroke="currentColor" 
                 strokeWidth="2.5"
                 strokeLinecap="round"
                 className="text-chaos-text"
               />
               <path 
                 d="M40 30 C 50 30, 80 40, 75 60 C 70 80, 45 70, 35 85" 
                 fill="none" 
                 stroke="currentColor" 
                 strokeWidth="2.5"
                 strokeLinecap="round"
                 className="text-chaos-accent"
               />
               
               {/* Nodes */}
               <circle cx="70" cy="25" r="3.5" className="fill-chaos-black stroke-chaos-text stroke-2" />
               <circle cx="25" cy="55" r="3.5" className="fill-chaos-black stroke-chaos-text stroke-2" />
               <circle cx="75" cy="75" r="3.5" className="fill-chaos-black stroke-chaos-text stroke-2" />
               
               <circle cx="40" cy="30" r="3.5" className="fill-chaos-black stroke-chaos-accent stroke-2" />
               <circle cx="75" cy="60" r="3.5" className="fill-chaos-black stroke-chaos-accent stroke-2" />
               <circle cx="35" cy="85" r="3.5" className="fill-chaos-black stroke-chaos-accent stroke-2" />
               
             </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-light text-lg tracking-wide leading-none">
              <span className="text-chaos-text group-hover:text-chaos-accent transition-colors">CHA</span>
              <span className="text-chaos-text">OS</span>
            </span>
             <span className="text-[10px] font-mono text-chaos-muted uppercase tracking-[0.2em] group-hover:text-chaos-text transition-colors leading-none mt-1">
              Sessions
            </span>
          </div>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onChangeView('home')}
            className={`text-sm hover:text-chaos-text transition-colors ${currentView === 'home' ? 'text-chaos-text border-b border-chaos-organic pb-1' : 'text-chaos-muted'}`}
          >
            {t.stream}
          </button>
          <button 
            onClick={() => onChangeView('docs')}
            className={`text-sm hover:text-chaos-text transition-colors flex items-center gap-2 ${currentView === 'docs' ? 'text-chaos-text border-b border-chaos-organic pb-1' : 'text-chaos-muted'}`}
          >
            {t.docs}
          </button>
        </div>

        {/* Auth / Profile / Language / Theme */}
        <div className="flex items-center gap-4">
          
          <button
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-chaos-muted hover:text-chaos-text transition-colors rounded-full hover:bg-chaos-panel"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <LanguageSelector currentLanguage={language} onLanguageChange={onLanguageChange} />

          {user.isAuthenticated ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onChangeView('profile')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-chaos-border bg-chaos-panel hover:border-chaos-organic transition-all ${currentView === 'profile' ? 'border-chaos-organic' : ''}`}
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-mono text-chaos-text">{user.alias || 'User'}</span>
              </button>
              <button 
                onClick={onLogout}
                className="text-xs text-chaos-muted hover:text-chaos-text underline underline-offset-4"
              >
                {t.exit}
              </button>
            </div>
          ) : (
            <button 
              onClick={onConnectRequest}
              className="flex items-center gap-2 px-4 py-2 bg-chaos-text text-chaos-black text-sm font-medium rounded hover:bg-chaos-muted transition-colors"
            >
              <Zap className="w-4 h-4" />
              {t.connect}
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};