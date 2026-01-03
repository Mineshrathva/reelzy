
import React, { useState } from 'react';

const EXPLORE_ITEMS = Array.from({ length: 12 }).map((_, i) => ({
  id: `exp-${i}`,
  url: `https://picsum.photos/seed/${i + 50}/400/600`,
  isReel: i % 3 === 0,
}));

const Explore: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto no-scrollbar">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 py-2 bg-slate-950/80 backdrop-blur-md">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search AI creators and trends..." 
            className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
        </div>
      </div>

      {/* Explore Grid */}
      <div className="grid grid-cols-3 gap-1">
        {EXPLORE_ITEMS.map((item, idx) => (
          <div 
            key={item.id} 
            className={`relative group bg-slate-900 overflow-hidden cursor-pointer ${item.isReel ? 'row-span-2' : 'aspect-square'}`}
          >
            <img src={item.url} alt="explore" className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:opacity-70" />
            {item.isReel && (
              <div className="absolute top-2 right-2 text-white drop-shadow-md">
                <i className="fa-solid fa-clapperboard text-sm"></i>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
               <span className="text-sm font-bold"><i className="fa-solid fa-heart mr-1"></i> {Math.floor(Math.random() * 500)}</span>
               <span className="text-sm font-bold"><i className="fa-solid fa-comment mr-1"></i> {Math.floor(Math.random() * 50)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
