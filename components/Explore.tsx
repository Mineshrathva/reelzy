
import React, { useState } from 'react';

const EXPLORE_ITEMS = Array.from({ length: 15 }).map((_, i) => ({
  id: `exp-${i}`,
  url: `https://picsum.photos/seed/${i + 50}/400/600`,
  isReel: i % 3 === 0,
}));

const Explore: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col min-h-full">
      {/* Search Bar */}
      <div className="p-3">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 opacity-40"></i>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search" 
            className="w-full bg-gray-500/10 rounded-lg py-1.5 pl-10 pr-4 text-[14px] focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-0.5 pb-10">
        {EXPLORE_ITEMS.map((item, idx) => (
          <div 
            key={item.id} 
            className={`relative group bg-gray-500/10 overflow-hidden cursor-pointer ${item.isReel ? 'row-span-2' : 'aspect-square'}`}
          >
            <img src={item.url} alt="explore" className="w-full h-full object-cover" />
            {item.isReel && (
              <div className="absolute top-2 right-2 text-white drop-shadow-md">
                <i className="fa-solid fa-clapperboard text-[12px]"></i>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
