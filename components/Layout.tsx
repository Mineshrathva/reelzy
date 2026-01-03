
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

type ModalType = 'settings' | 'qr' | 'archive' | 'logout' | null;

interface SettingsState {
  isPrivate: boolean;
  showActivity: boolean;
  darkMode: boolean;
  pushNotifications: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('reelzy_settings');
    return saved ? JSON.parse(saved) : {
      isPrivate: false,
      showActivity: true,
      darkMode: true,
      pushNotifications: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('reelzy_settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const isImmersive = activeView === 'reels';
  const isHome = activeView === 'feed';
  const isProfile = activeView === 'profile';

  const toggleSetting = (key: keyof SettingsState) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMenuAction = (label: string) => {
    setIsMenuOpen(false);
    switch (label) {
      case 'Settings and privacy': setActiveModal('settings'); break;
      case 'Your activity': setActiveView('activity'); break;
      case 'Archive': setActiveModal('archive'); break;
      case 'QR code': setActiveModal('qr'); break;
      case 'Log out': setActiveModal('logout'); break;
      default: alert(`${label} feature is coming soon!`); break;
    }
  };

  const menuItems = [
    { icon: 'fa-gear', label: 'Settings and privacy' },
    { icon: 'fa-chart-line', label: 'Your activity' },
    { icon: 'fa-clock-rotate-left', label: 'Archive' },
    { icon: 'fa-qrcode', label: 'QR code' },
    { icon: 'fa-bookmark', label: 'Saved' },
    { icon: 'fa-users-gear', label: 'Supervision' },
    { icon: 'fa-circle-check', label: 'Verified' },
    { icon: 'fa-right-from-bracket', label: 'Log out', color: 'text-red-500' },
  ];

  const bgColor = settings.darkMode ? 'bg-black' : 'bg-white';
  const textColor = settings.darkMode ? 'text-white' : 'text-black';
  const borderColor = settings.darkMode ? 'border-[#262626]' : 'border-[#dbdbdb]';
  const headerBg = settings.darkMode ? 'bg-black/95' : 'bg-white/95';

  return (
    <div className={`flex flex-col h-screen overflow-hidden transition-colors duration-200 relative ${bgColor} ${textColor}`}>
      {/* Header */}
      {!isImmersive && (
        <header className={`h-14 flex items-center justify-between px-4 z-50 shrink-0 relative border-b backdrop-blur-md ${headerBg} ${borderColor}`}>
          <div className="flex items-center gap-4 min-w-[100px]">
            {isHome ? (
              <button onClick={() => setActiveView('create')} className={`text-2xl hover:opacity-70 transition active:scale-90 ${textColor}`}>
                <i className="fa-regular fa-square-plus"></i>
              </button>
            ) : isProfile ? (
              <div className="flex items-center gap-1">
                <h1 className="text-xl font-bold tracking-tight">reelzy_pioneer</h1>
                {settings.isPrivate && <i className="fa-solid fa-lock text-[12px] opacity-60"></i>}
              </div>
            ) : (
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('feed')}>
                <h1 className="text-xl font-bold tracking-tight italic">Reelzy</h1>
              </div>
            )}
          </div>

          {isHome && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <h1 className="text-2xl font-bold italic tracking-tight">Reelzy</h1>
            </div>
          )}
          
          <div className="flex items-center gap-5 min-w-[100px] justify-end">
            {isHome && (
              <>
                <button onClick={() => setActiveView('activity')} className={`text-2xl hover:opacity-70 transition active:scale-90 ${textColor}`}>
                  <i className="fa-regular fa-heart"></i>
                </button>
                <button onClick={() => setActiveView('messages')} className={`text-2xl relative hover:opacity-70 transition active:scale-90 ${textColor}`}>
                  <i className="fa-regular fa-paper-plane"></i>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3040] rounded-full text-[10px] flex items-center justify-center font-bold text-white border border-white dark:border-black">2</span>
                </button>
              </>
            )}
            {isProfile && (
              <>
                <button onClick={() => setActiveView('create')} className={`text-2xl hover:opacity-70 transition active:scale-90 ${textColor}`}>
                  <i className="fa-regular fa-square-plus"></i>
                </button>
                <button onClick={() => setIsMenuOpen(true)} className={`text-2xl hover:opacity-70 transition active:scale-90 ${textColor}`}>
                  <i className="fa-solid fa-bars"></i>
                </button>
              </>
            )}
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 no-scrollbar overflow-y-auto">
        <div className={`${isImmersive ? 'w-full h-full' : 'max-w-screen-sm mx-auto'}`}>
          {children}
        </div>
      </main>

      {/* Navigation Bar - Instagram Style */}
      <nav className={`h-12 flex items-center justify-around z-50 px-2 shrink-0 border-t transition-colors duration-200 ${headerBg} ${borderColor}`}>
        <NavButton 
          active={activeView === 'feed'} 
          icon="fa-solid fa-house" 
          onClick={() => setActiveView('feed')} 
          darkMode={settings.darkMode} 
        />
        <NavButton 
          active={activeView === 'explore'} 
          icon="fa-solid fa-magnifying-glass" 
          onClick={() => setActiveView('explore')} 
          darkMode={settings.darkMode} 
        />
        <button 
          onClick={() => setActiveView('create')} 
          className={`text-2xl hover:opacity-70 transition active:scale-90 p-2 ${textColor}`}
        >
          <i className="fa-regular fa-square-plus"></i>
        </button>
        <NavButton 
          active={activeView === 'reels'} 
          icon="fa-solid fa-clapperboard" 
          onClick={() => setActiveView('reels')} 
          darkMode={settings.darkMode} 
        />
        <NavButton 
          active={activeView === 'profile'} 
          icon="fa-solid fa-circle-user" 
          onClick={() => setActiveView('profile')} 
          darkMode={settings.darkMode} 
        />
      </nav>

      {/* Bottom Sheet for Menu */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute bottom-0 left-0 right-0 rounded-t-xl transition-transform duration-300 ${isMenuOpen ? 'translate-y-0' : 'translate-y-full'} ${settings.darkMode ? 'bg-[#262626]' : 'bg-white'}`}>
          <div className="w-9 h-1 bg-gray-500/30 rounded-full mx-auto my-3"></div>
          <div className="pb-8">
            {menuItems.map((item, idx) => (
              <button key={idx} onClick={() => handleMenuAction(item.label)} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-500/10 transition active:opacity-50 ${item.color || textColor}`}>
                <div className="w-8 flex justify-center text-xl"><i className={`fa-solid ${item.icon}`}></i></div>
                <span className="text-[15px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals for Settings, QR, etc. */}
      {activeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setActiveModal(null)} />
          <div className={`relative w-full max-w-[320px] rounded-xl overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200 ${settings.darkMode ? 'bg-[#262626]' : 'bg-white'}`}>
            {activeModal === 'settings' && (
              <div className="p-4 space-y-4">
                <h3 className="text-center font-bold pb-2 border-b border-gray-500/10">Settings</h3>
                <div className="space-y-4">
                  <ToggleItem label="Private Account" checked={settings.isPrivate} onChange={() => toggleSetting('isPrivate')} darkMode={settings.darkMode} />
                  <ToggleItem label="Show Activity Status" checked={settings.showActivity} onChange={() => toggleSetting('showActivity')} darkMode={settings.darkMode} />
                  <ToggleItem label="Dark Mode" checked={settings.darkMode} onChange={() => toggleSetting('darkMode')} darkMode={settings.darkMode} />
                  <ToggleItem label="Push Notifications" checked={settings.pushNotifications} onChange={() => toggleSetting('pushNotifications')} darkMode={settings.darkMode} />
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full pt-4 font-bold text-[#0095F6] border-t border-gray-500/10 active:opacity-50">Done</button>
              </div>
            )}
            {activeModal === 'logout' && (
              <div className="text-center">
                <div className="p-6 border-b border-gray-500/10">
                  <h3 className="text-xl font-bold mb-2">Log out?</h3>
                  <p className="text-sm opacity-60">You'll need to login again to access your Reelzy account.</p>
                </div>
                <button onClick={() => { setActiveModal(null); setActiveView('feed'); }} className="w-full py-3 text-[#ED4956] font-bold border-b border-gray-500/10 active:bg-gray-500/10">Log Out</button>
                <button onClick={() => setActiveModal(null)} className="w-full py-3 active:bg-gray-500/10">Cancel</button>
              </div>
            )}
            {activeModal === 'qr' && (
              <div className="p-8 flex flex-col items-center gap-6">
                 <div className="p-4 bg-white rounded-lg shadow-inner">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=reelzy_pioneer&color=000000`} alt="QR" className="w-40 h-40" />
                 </div>
                 <div className="text-center">
                   <h3 className="font-bold text-lg">@reelzy_pioneer</h3>
                   <p className="text-sm opacity-60">Scan to follow me on Reelzy</p>
                 </div>
                 <button onClick={() => setActiveModal(null)} className="font-bold text-[#0095F6] active:opacity-50">Close</button>
              </div>
            )}
            {activeModal === 'archive' && (
              <div className="p-10 text-center space-y-4">
                <div className="text-5xl opacity-20"><i className="fa-solid fa-clock-rotate-left"></i></div>
                <h3 className="font-bold">Archive is empty</h3>
                <p className="text-sm opacity-60">Your archived posts will show up here.</p>
                <button onClick={() => setActiveModal(null)} className="font-bold text-[#0095F6] pt-4 active:opacity-50">Back</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ToggleItem = ({ label, checked, onChange, darkMode }: { label: string; checked: boolean; onChange: () => void; darkMode: boolean }) => (
  <button onClick={onChange} className="w-full flex items-center justify-between py-1 active:opacity-50 transition-opacity">
    <span className="text-[14px] font-medium opacity-90">{label}</span>
    <div className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 relative ${checked ? 'bg-[#0095F6]' : (darkMode ? 'bg-[#363636]' : 'bg-[#dbdbdb]')}`}>
      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </button>
);

const NavButton = ({ active, icon, onClick, darkMode }: { active: boolean; icon: string; onClick: () => void; darkMode: boolean }) => (
  <button 
    onClick={onClick} 
    className={`text-2xl transition-all active:scale-90 p-2 
      ${darkMode ? 'text-white' : 'text-black'} 
      ${active ? 'opacity-100' : 'opacity-40'}
    `}
  >
    <i className={icon}></i>
  </button>
);

export default Layout;
