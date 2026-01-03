
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-50">
      {/* Top Header */}
      <header className="h-16 flex items-center justify-between px-5 glass border-b border-white/5 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 btn-gradient rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fa-solid fa-bolt-lightning text-white text-sm"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight italic">Reelzy<span className="text-teal-400">AI</span></h1>
        </div>
        
        <div className="flex items-center gap-5">
          <button className="text-xl text-slate-300 hover:text-white transition">
            <i className="fa-regular fa-heart"></i>
          </button>
          <button className="text-xl text-slate-300 hover:text-white transition relative">
            <i className="fa-regular fa-paper-plane"></i>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">2</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar bg-slate-950">
        <div className="max-w-4xl mx-auto h-full">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="h-16 glass border-t border-white/5 flex items-center justify-around z-50 px-2">
        <NavButton active={activeView === 'feed'} icon="fa-house" activeIcon="fa-house" label="Home" onClick={() => setActiveView('feed')} />
        <NavButton active={activeView === 'explore'} icon="fa-magnifying-glass" activeIcon="fa-magnifying-glass" label="Explore" onClick={() => setActiveView('explore')} />
        
        <button 
          onClick={() => setActiveView('create')}
          className="w-12 h-10 rounded-xl glass border border-white/10 flex items-center justify-center transition active:scale-90 hover:border-teal-400/50"
        >
          <i className="fa-solid fa-square-plus text-xl text-slate-200"></i>
        </button>

        <NavButton active={activeView === 'studio'} icon="fa-clapperboard" activeIcon="fa-clapperboard" label="Studio" onClick={() => setActiveView('studio')} />
        <NavButton active={activeView === 'profile'} icon="fa-circle-user" activeIcon="fa-circle-user" label="Profile" onClick={() => setActiveView('profile')} />
      </nav>
    </div>
  );
};

const NavButton = ({ active, icon, activeIcon, label, onClick }: { active: boolean; icon: string; activeIcon: string; label: string; onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${active ? 'text-teal-400 scale-110' : 'text-slate-500'}`}>
    <i className={`fa-solid ${active ? activeIcon : icon} text-xl`}></i>
    <span className={`text-[9px] font-bold tracking-wider uppercase transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
  </button>
);

export default Layout;
