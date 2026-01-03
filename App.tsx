
import React, { useState } from 'react';
import { AppView, GeneratedAsset } from './types';
import Layout from './components/Layout';
import Feed from './components/Feed';
import CreateVideo from './components/CreateVideo';
import Assistant from './components/Assistant';
import Explore from './components/Explore';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('feed');
  const [studioAssets, setStudioAssets] = useState<GeneratedAsset[]>([]);
  const [profileTab, setProfileTab] = useState<'grid' | 'reels' | 'saved'>('grid');

  const handleAssetCreated = (asset: GeneratedAsset) => {
    setStudioAssets(prev => [asset, ...prev]);
    setActiveView('studio');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'feed':
        return <Feed />;
      case 'explore':
        return <Explore />;
      case 'create':
        return <CreateVideo onAssetCreated={handleAssetCreated} />;
      case 'assistant':
        return <Assistant />;
      case 'studio':
        return (
          <div className="p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
               <i className="fa-solid fa-clapperboard text-teal-400"></i>
               Creative Studio
            </h2>
            {studioAssets.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-slate-900/50 rounded-3xl border border-white/5 border-dashed">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                  <i className="fa-solid fa-photo-film text-3xl text-slate-600"></i>
                </div>
                <h3 className="text-lg font-bold mb-2">Start your journey</h3>
                <p className="text-slate-500 max-w-xs mb-8">Generated assets will appear here. Create your first viral hit with Gemini.</p>
                <button 
                  onClick={() => setActiveView('create')}
                  className="px-8 py-3 btn-gradient rounded-full font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition"
                >
                  Create Content
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 overflow-y-auto no-scrollbar">
                {studioAssets.map(asset => (
                  <div key={asset.id} className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-[9/16] border border-white/5 ring-1 ring-white/5">
                    {asset.type === 'video' ? (
                      <video src={asset.url} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={asset.url} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                      <p className="text-[10px] text-slate-300 line-clamp-2">{asset.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'profile':
        return (
          <div className="h-full flex flex-col">
            {/* Profile Header */}
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full p-1 btn-gradient shadow-xl shadow-indigo-500/20">
                    <div className="w-full h-full rounded-full bg-slate-950 border-4 border-slate-950 overflow-hidden">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=reelzy_pioneer" alt="profile" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 flex justify-between">
                  <StatItem label="Posts" value={studioAssets.length} />
                  <StatItem label="Followers" value="1.2K" />
                  <StatItem label="Following" value="482" />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold">Creator Beta</h2>
                <p className="text-xs text-slate-500 mb-2">AI Enthusiast • Digital Storyteller</p>
                <p className="text-sm text-slate-300">Pushing the boundaries of short-form content with generative AI. ⚡️</p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-xl bg-slate-800 font-bold text-sm hover:bg-slate-700 transition">Edit Profile</button>
                <button className="flex-1 py-2 rounded-xl bg-slate-800 font-bold text-sm hover:bg-slate-700 transition">Share Profile</button>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-t border-white/5">
              <TabBtn active={profileTab === 'grid'} icon="fa-table-cells" onClick={() => setProfileTab('grid')} />
              <TabBtn active={profileTab === 'reels'} icon="fa-clapperboard" onClick={() => setProfileTab('reels')} />
              <TabBtn active={profileTab === 'saved'} icon="fa-bookmark" onClick={() => setProfileTab('saved')} />
            </div>

            {/* Profile Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-3 gap-0.5">
              {studioAssets.length > 0 ? (
                studioAssets.map(asset => (
                   <div key={asset.id} className="aspect-square bg-slate-900 overflow-hidden border border-white/5">
                      <img src={asset.type === 'image' ? asset.url : 'https://picsum.photos/seed/video-thumb/400/400'} className="w-full h-full object-cover" />
                   </div>
                ))
              ) : (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-slate-900/50 animate-pulse-soft border border-white/5"></div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return <Feed />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </Layout>
  );
};

const StatItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col items-center">
    <span className="text-lg font-bold">{value}</span>
    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{label}</span>
  </div>
);

const TabBtn = ({ active, icon, onClick }: { active: boolean; icon: string; onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 py-4 text-xl transition-all relative ${active ? 'text-teal-400' : 'text-slate-500'}`}
  >
    <i className={`fa-solid ${icon}`}></i>
    {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 btn-gradient"></div>}
  </button>
);

export default App;
