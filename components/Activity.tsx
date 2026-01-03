
import React from 'react';

const NOTIFICATIONS = [
  { id: 1, user: 'pixel_wizard', action: 'liked your video', time: '2m', avatar: 'pixel_wizard', type: 'like' },
  { id: 2, user: 'ai_visionary', action: 'started following you', time: '1h', avatar: 'ai_visionary', type: 'follow' },
  { id: 3, user: 'cyber_punk', action: 'commented: "This AI gen is insane! 🔥"', time: '3h', avatar: 'cyber_punk', type: 'comment' },
  { id: 4, user: 'future_flow', action: 'liked your prompt', time: '5h', avatar: 'future_flow', type: 'like' },
  { id: 5, user: 'glitch_art', action: 'mentioned you in a reel', time: '1d', avatar: 'glitch_art', type: 'mention' },
];

const Activity: React.FC = () => {
  return (
    <div className="flex flex-col min-h-full">
      <div className="p-4 border-b border-gray-500/10">
        <h2 className="text-xl font-bold">Activity</h2>
      </div>
      
      <div className="divide-y divide-gray-500/5">
        <div className="px-4 py-3">
          <h3 className="text-[14px] font-bold">New</h3>
          {NOTIFICATIONS.slice(0, 1).map(item => (
            <NotificationItem key={item.id} {...item} />
          ))}
        </div>
        
        <div className="px-4 py-3">
          <h3 className="text-[14px] font-bold">Earlier</h3>
          {NOTIFICATIONS.slice(1).map(item => (
            <NotificationItem key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

const NotificationItem = ({ user, action, time, avatar }: any) => (
  <div className="flex items-center gap-3 py-3 active:opacity-50 cursor-pointer">
    <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-500/10">
      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar}`} alt="avatar" />
    </div>
    <div className="flex-1">
      <p className="text-[13px] leading-tight">
        <span className="font-bold mr-1">{user}</span>
        <span className="opacity-90">{action}</span>
        <span className="opacity-40 ml-1">{time}</span>
      </p>
    </div>
    <div className="w-10 h-10 rounded overflow-hidden bg-gray-500/10">
      <img src={`https://picsum.photos/seed/${user}/100/100`} alt="content" className="w-full h-full object-cover" />
    </div>
  </div>
);

export default Activity;
