
import React, { useState } from 'react';

const CHATS = [
  { id: 1, user: 'Gemini AI', message: 'Ready to generate some magic?', time: 'Just now', avatar: 'gemini', active: true, unread: true },
  { id: 2, user: 'pixel_wizard', message: 'Sent a video', time: '12m', avatar: 'pixel_wizard', active: true, unread: true },
  { id: 3, user: 'neon_knight', message: 'Check out this prompt!', time: '1h', avatar: 'neon_knight', active: false, unread: false },
  { id: 4, user: 'future_flow', message: 'Lol that was great', time: '3h', avatar: 'future_flow', active: true, unread: false },
  { id: 5, user: 'glitch_art', message: 'You active?', time: 'Yesterday', avatar: 'glitch_art', active: false, unread: false },
];

const Messages: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-4 flex items-center justify-between border-b border-gray-500/10 sticky top-0 bg-inherit backdrop-blur-md z-10">
        <h2 className="text-xl font-bold">Messages</h2>
        <button className="text-[#0095F6] font-bold text-sm">Requests</button>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 opacity-40"></i>
          <input 
            type="text" 
            placeholder="Search" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-500/10 rounded-lg py-1.5 pl-10 pr-4 text-[14px] focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          {CHATS.map(chat => (
            <div key={chat.id} className="flex items-center gap-3 py-2 active:opacity-50 cursor-pointer group">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border border-gray-500/10 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.avatar}`} alt="avatar" />
                </div>
                {chat.active && (
                  <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 border-4 border-white dark:border-black rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className={`text-[14px] truncate ${chat.unread ? 'font-bold' : 'opacity-90'}`}>{chat.user}</h4>
                  <span className={`text-[12px] ${chat.unread ? 'text-[#0095F6] font-bold' : 'opacity-40'}`}>{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                   <p className={`text-[13px] truncate ${chat.unread ? 'font-bold' : 'opacity-40'}`}>
                    {chat.message}
                  </p>
                  {chat.unread && (
                    <div className="w-2 h-2 bg-[#0095F6] rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
