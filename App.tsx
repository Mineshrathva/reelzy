
import React, { useState, useMemo, useEffect } from 'react';
import { AppView, GeneratedAsset, Reel, UserProfile } from './types';
import Layout from './components/Layout';
import Feed from './components/Feed';
import CreateVideo from './components/CreateVideo';
import Assistant from './components/Assistant';
import Explore from './components/Explore';
import ReelsFeed from './components/ReelsFeed';
import Activity from './components/Activity';
import Messages from './components/Messages';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('feed');
  const [studioAssets, setStudioAssets] = useState<GeneratedAsset[]>([]);
  const [profileTab, setProfileTab] = useState<'grid' | 'reels' | 'saved'>('grid');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('reelzy_user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Reelzy Pioneer',
      username: 'reelzy_pioneer',
      bio: 'Generating the future of short-form one frame at a time. ⚡️',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reelzy_pioneer',
      posts: 0,
      followers: '1.2K',
      following: 482
    };
  });

  useEffect(() => {
    localStorage.setItem('reelzy_user_profile', JSON.stringify(profile));
  }, [profile]);

  const handleAssetCreated = (asset: GeneratedAsset) => {
    setStudioAssets(prev => [asset, ...prev]);
    setActiveView('profile');
  };

  const userReels: Reel[] = useMemo(() => {
    return studioAssets
      .filter(a => a.type === 'video')
      .map(a => ({
        id: a.id,
        url: a.url,
        title: 'Generated Reel',
        author: profile.username,
        likes: 0,
        comments: 0,
        description: a.prompt,
        isLiked: false
      }));
  }, [studioAssets, profile.username]);

  const renderContent = () => {
    switch (activeView) {
      case 'feed': return <Feed currentUser={profile.username} />;
      case 'reels': return <ReelsFeed userAssets={userReels} currentUser={profile.username} />;
      case 'explore': return <Explore />;
      case 'create': return <CreateVideo onAssetCreated={handleAssetCreated} />;
      case 'assistant': return <Assistant />;
      case 'activity': return <Activity />;
      case 'messages': return <Messages />;
      case 'profile':
        return (
          <div className="h-full flex flex-col">
            {/* Profile Header */}
            <div className="p-4 px-5 space-y-4">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-full p-1 border border-gray-500/10">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img src={profile.avatar} alt="profile" />
                  </div>
                </div>
                <div className="flex-1 flex justify-around">
                  <StatItem label="Posts" value={studioAssets.length} />
                  <StatItem label="Followers" value={profile.followers} />
                  <StatItem label="Following" value={profile.following} />
                </div>
              </div>

              <div className="space-y-0.5">
                <h2 className="text-[14px] font-bold">{profile.name}</h2>
                <p className="text-[14px] opacity-60">AI Creator • Beta Tester</p>
                <p className="text-[14px]">{profile.bio}</p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex-1 py-1.5 rounded-lg bg-gray-500/10 font-bold text-[14px] active:opacity-50 transition"
                >
                  Edit Profile
                </button>
                <button className="flex-1 py-1.5 rounded-lg bg-gray-500/10 font-bold text-[14px] active:opacity-50 transition">Share Insights</button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-t border-gray-500/10 mt-4">
              <TabBtn active={profileTab === 'grid'} icon="fa-table-cells" onClick={() => setProfileTab('grid')} />
              <TabBtn active={profileTab === 'reels'} icon="fa-clapperboard" onClick={() => setProfileTab('reels')} />
              <TabBtn active={profileTab === 'saved'} icon="fa-bookmark" onClick={() => setProfileTab('saved')} />
            </div>

            {/* Grid */}
            <div className="flex-1 grid grid-cols-3 gap-0.5">
              {studioAssets.length > 0 ? (
                studioAssets.map(asset => (
                   <div key={asset.id} className="relative aspect-square bg-gray-100 dark:bg-zinc-900 overflow-hidden group">
                      {asset.type === 'video' ? (
                        <div className="w-full h-full relative">
                           <video src={asset.url} className="w-full h-full object-cover" />
                           <div className="absolute top-1 right-1 text-white text-[10px]"><i className="fa-solid fa-play"></i></div>
                        </div>
                      ) : (
                        <img src={asset.url} className="w-full h-full object-cover" />
                      )}
                   </div>
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-20 opacity-30">
                  <i className="fa-solid fa-camera text-4xl mb-2"></i>
                  <p className="text-sm">No Posts Yet</p>
                </div>
              )}
            </div>
          </div>
        );
      default: return <Feed />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
      
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#262626] w-full max-w-md rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-4 border-b dark:border-white/10">
              <button onClick={() => setIsEditModalOpen(false)} className="text-sm font-medium">Cancel</button>
              <h3 className="font-bold">Edit profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="text-sm font-bold text-[#0095F6]"
              >
                Done
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full overflow-hidden border dark:border-white/10">
                  <img src={profile.avatar} alt="edit avatar" />
                </div>
                <button className="text-[14px] font-bold text-[#0095F6]">Change profile photo</button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[12px] opacity-60 ml-1">Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full bg-transparent border-b dark:border-white/10 pb-2 focus:outline-none focus:border-[#0095F6] transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] opacity-60 ml-1">Username</label>
                  <input 
                    type="text" 
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    className="w-full bg-transparent border-b dark:border-white/10 pb-2 focus:outline-none focus:border-[#0095F6] transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] opacity-60 ml-1">Bio</label>
                  <textarea 
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full bg-transparent border-b dark:border-white/10 pb-2 focus:outline-none focus:border-[#0095F6] transition-colors resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

const StatItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col items-center">
    <span className="text-[16px] font-bold">{value}</span>
    <span className="text-[13px] opacity-70">{label}</span>
  </div>
);

const TabBtn = ({ active, icon, onClick }: { active: boolean; icon: string; onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 py-3 text-xl transition-all relative ${active ? 'opacity-100' : 'opacity-30'}`}
  >
    <i className={`fa-solid ${icon}`}></i>
    {active && <div className="absolute top-0 left-0 right-0 h-0.5 bg-current"></div>}
  </button>
);

export default App;
