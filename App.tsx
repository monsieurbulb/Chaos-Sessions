
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Documentation } from './pages/Documentation';
import { AdminLogin } from './pages/AdminLogin';
import { CMS } from './pages/CMS';
import { Status } from './pages/Status';
import { Navbar } from './components/Navbar';
import { ConnectModal } from './components/ConnectModal';
import { User, ViewMode, VideoSession, LiveEvent, Ticket, Language, Theme } from './types';
import { connectWallet, fetchEvents, subscribeToEvent } from './services/mockServices';
import { MOCK_VIDEOS } from './constants';
import { dictionaries } from './translations';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');
  const [user, setUser] = useState<User>({
    address: '',
    isAuthenticated: false,
    subscribedEvents: [],
    tickets: [],
    assets: [],
    balance: 0,
    points: 0,
    addressBook: [],
  });
  // Maintain videos in state to allow CMS updates
  const [videos, setVideos] = useState<VideoSession[]>(MOCK_VIDEOS);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Apply theme to body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Load events on mount
  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchEvents();
      setEvents(data);
    };
    loadEvents();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Simulate Virto Connect API call
      const connectedUser = await connectWallet();
      setUser(connectedUser);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Connection failed", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = () => {
    setUser({
      address: '',
      isAuthenticated: false,
      subscribedEvents: [],
      tickets: [],
      assets: [],
      balance: 0,
      points: 0,
      addressBook: [],
    });
    setView('home');
  };

  const handleAddVideo = (newVideo: VideoSession) => {
    setVideos(prev => [newVideo, ...prev]);
  };

  const handleToggleSubscription = (eventId: string, ticketType?: Ticket['type']) => {
    const updatedUser = subscribeToEvent(user, eventId, ticketType);
    setUser(updatedUser);
  };

  // Get current translation object
  const t = dictionaries[language];

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <Home 
            user={user} 
            onConnectRequest={() => setIsModalOpen(true)} 
            videos={videos} 
            events={events}
            onToggleSubscription={handleToggleSubscription}
            t={t.home}
          />
        );
      case 'profile':
        return (
          <Profile 
            user={user} 
            onUpdateUser={setUser} 
            onConnectRequest={() => setIsModalOpen(true)} 
            events={events} 
            t={{ ...t.profile, wallet: t.wallet }}
          />
        );
      case 'docs':
        return <Documentation />;
      case 'admin-login':
        return <AdminLogin onLoginSuccess={() => setView('cms')} onCancel={() => setView('home')} />;
      case 'cms':
        return <CMS onAddVideo={handleAddVideo} onExit={() => setView('home')} />;
      case 'status':
        return <Status />;
      default:
        return (
          <Home 
            user={user} 
            onConnectRequest={() => setIsModalOpen(true)} 
            videos={videos} 
            events={events}
            onToggleSubscription={handleToggleSubscription}
            t={t.home}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-chaos-black text-chaos-text font-sans selection:bg-chaos-organic selection:text-white flex flex-col">
      <Navbar 
        currentView={view}
        onChangeView={setView}
        user={user}
        onConnectRequest={() => setIsModalOpen(true)}
        onLogout={handleLogout}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeChange={setTheme}
        t={t.nav}
      />
      
      <main className="flex-grow pt-10 px-4 pb-20">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-chaos-border bg-chaos-black py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-chaos-muted font-mono">
           <p>© 2025 Chaos Sessions. c/o birdbrain</p>
           <div className="flex gap-6 mt-4 md:mt-0 items-center">
             <button onClick={() => setView('status')} className="hover:text-chaos-accent transition-colors">Status</button>
             <a href="https://github.com/Decent-Partners/Feather-Index" target="_blank" rel="noopener noreferrer" className="hover:text-chaos-accent transition-colors">GitHub</a>
             {view !== 'admin-login' && view !== 'cms' && (
                <button 
                  onClick={() => setView('admin-login')}
                  className="text-stone-600 hover:text-chaos-accent transition-colors ml-4 uppercase tracking-widest"
                >
                  Admin Access
                </button>
             )}
           </div>
        </div>
      </footer>

      <ConnectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnect}
        isConnecting={isConnecting}
        t={t.auth}
      />
    </div>
  );
};

export default App;
