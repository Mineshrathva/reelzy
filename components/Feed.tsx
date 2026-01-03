
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Reel, PostComment } from '../types';

const MOCK_AUTHORS = ['cyber_punk', 'pixel_wizard', 'ai_visionary', 'neon_knight', 'future_flow', 'glitch_art'];
const MOCK_TITLES = ['City Lights', 'Deep Space', 'Digital Nature', 'Holographic Dreams', 'Synthwave Night', 'Binary Sunset'];

const generateMockPosts = (count: number, startIndex: number): Reel[] => {
  return Array.from({ length: count }).map((_, i) => {
    const id = `post-${startIndex + i}`;
    const author = MOCK_AUTHORS[Math.floor(Math.random() * MOCK_AUTHORS.length)];
    const title = MOCK_TITLES[Math.floor(Math.random() * MOCK_TITLES.length)];
    const isVideo = (startIndex + i) % 2 === 0;
    const url = isVideo 
      ? 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-lighting-sitting-at-a-bar-34674-large.mp4'
      : `https://picsum.photos/seed/${id}/1080/1350`;

    return {
      id,
      url,
      title,
      author,
      likes: Math.floor(Math.random() * 5000) + 100,
      comments: Math.floor(Math.random() * 200) + 10,
      description: `Exploring the boundaries of ${title.toLowerCase()} in the digital age. #AI #Future #Visuals`,
      isLiked: false,
      isSaved: false
    };
  });
};

const Feed: React.FC<{ currentUser?: string }> = ({ currentUser = 'reelzy_pioneer' }) => {
  const [posts, setPosts] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [activeSheet, setActiveSheet] = useState<{ type: 'comments' | 'share' | 'more', postId: string } | null>(null);
  const [commentText, setCommentText] = useState('');
  
  const [postComments, setPostComments] = useState<Record<string, PostComment[]>>({});

  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMorePosts = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const newPosts = generateMockPosts(5, page * 5);
    setPosts(prev => [...prev, ...newPosts]);
    setPage(prev => prev + 1);
    setLoading(false);
  }, [loading, page]);

  useEffect(() => {
    loadMorePosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMorePosts]);

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const toggleSave = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p));
  };

  const addComment = () => {
    if (!commentText.trim() || !activeSheet) return;
    const newComment: PostComment = {
      id: Math.random().toString(),
      user: currentUser,
      text: commentText,
      time: 'Just now',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser}`
    };
    setPostComments(prev => ({
      ...prev,
      [activeSheet.postId]: [newComment, ...(prev[activeSheet.postId] || [])]
    }));
    setCommentText('');
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Stories Bar */}
      <div className="flex gap-4 p-4 overflow-x-auto no-scrollbar border-b border-gray-500/10">
        <StoryItem label="Your Story" isUser />
        {MOCK_AUTHORS.map(author => (
          <StoryItem key={author} label={author} />
        ))}
      </div>

      {/* Vertical Infinity Feed */}
      <div className="flex flex-col items-center">
        {posts.map(post => (
          <div key={post.id} className="w-full max-w-lg mb-6 border-b border-gray-500/10">
            {/* Post Header */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                  <div className="w-full h-full rounded-full bg-white dark:bg-black p-[1.5px]">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold hover:opacity-60 cursor-pointer">{post.author}</span>
                  <span className="text-[11px] opacity-60 font-medium">{post.title}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveSheet({ type: 'more', postId: post.id })}
                className="opacity-60 hover:opacity-100 p-2"
              >
                <i className="fa-solid fa-ellipsis"></i>
              </button>
            </div>

            {/* Post Media */}
            <div className="relative aspect-square bg-gray-100 dark:bg-zinc-900">
              {post.url.endsWith('.mp4') ? (
                <video 
                  src={post.url} 
                  className="w-full h-full object-cover" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                />
              ) : (
                <img src={post.url} alt="post" className="w-full h-full object-cover" />
              )}
            </div>

            {/* Post Actions */}
            <div className="p-3 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleLike(post.id)} className={`text-2xl transition-transform active:scale-125 ${post.isLiked ? 'text-[#FF3040]' : ''}`}>
                    <i className={post.isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                  </button>
                  <button 
                    onClick={() => setActiveSheet({ type: 'comments', postId: post.id })}
                    className="text-2xl hover:opacity-60"
                  >
                    <i className="fa-regular fa-comment"></i>
                  </button>
                  <button 
                    onClick={() => setActiveSheet({ type: 'share', postId: post.id })}
                    className="text-2xl hover:opacity-60"
                  >
                    <i className="fa-regular fa-paper-plane"></i>
                  </button>
                </div>
                <button onClick={() => toggleSave(post.id)} className={`text-2xl ${post.isSaved ? 'text-blue-500' : ''}`}>
                  <i className={post.isSaved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                </button>
              </div>

              {/* Likes & Caption */}
              <div className="space-y-1">
                <p className="text-[14px] font-bold">{post.likes.toLocaleString()} likes</p>
                <div className="text-[14px] leading-relaxed">
                  <span className="font-bold mr-2">{post.author}</span>
                  <span className="opacity-90">{post.description}</span>
                </div>
                <button 
                  onClick={() => setActiveSheet({ type: 'comments', postId: post.id })}
                  className="text-[14px] opacity-50 block mt-1"
                >
                  View all {post.comments + (postComments[post.id]?.length || 0)} comments
                </button>
                <p className="text-[10px] opacity-40 uppercase tracking-tighter pt-1">2 hours ago</p>
              </div>
            </div>
          </div>
        ))}

        {/* Loading */}
        <div ref={observerTarget} className="w-full py-10 flex flex-col items-center gap-2">
          {loading && (
            <div className="w-6 h-6 border-2 border-gray-500/20 border-t-gray-500 rounded-full animate-spin"></div>
          )}
        </div>
      </div>

      {/* Sheets Overlay */}
      {activeSheet && (
        <div className="fixed inset-0 z-[150] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setActiveSheet(null)} />
          
          <div className="relative bg-white dark:bg-[#262626] rounded-t-xl overflow-hidden animate-in slide-in-from-bottom-full duration-300 max-h-[70vh] flex flex-col">
            <div className="w-9 h-1 bg-gray-500/30 rounded-full mx-auto my-3 shrink-0"></div>
            
            {activeSheet.type === 'comments' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="text-center font-bold border-b dark:border-white/10 pb-3 shrink-0">Comments</div>
                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                  {(postComments[activeSheet.postId] || []).map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                  <div className="text-center py-10 opacity-40 text-sm">
                    { (postComments[activeSheet.postId] || []).length === 0 ? "No comments yet. Be the first to reply!" : "You've reached the end." }
                  </div>
                </div>
                <div className="p-4 border-t dark:border-white/10 flex items-center gap-3 bg-inherit">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser}`} alt="my avatar" />
                  </div>
                  <input 
                    type="text" 
                    placeholder={`Comment as ${currentUser}...`}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-transparent text-sm focus:outline-none"
                    autoFocus
                  />
                  <button 
                    onClick={addComment}
                    disabled={!commentText.trim()}
                    className="text-[#0095F6] font-bold text-sm disabled:opacity-30"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}

            {activeSheet.type === 'share' && (
              <div className="p-4 space-y-6">
                <div className="text-center font-bold">Share to...</div>
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2">
                  {MOCK_AUTHORS.map(user => (
                    <div key={user} className="flex flex-col items-center gap-1 shrink-0">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-500/10">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`} alt="user" />
                      </div>
                      <span className="text-[11px] opacity-70">{user}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-4 pb-4">
                  <ShareOption icon="fa-copy" label="Copy Link" />
                  <ShareOption icon="fa-share-nodes" label="Share via..." />
                  <ShareOption icon="fa-paper-plane" label="Send in Chat" />
                  <ShareOption icon="fa-envelope" label="Email" />
                </div>
              </div>
            )}

            {activeSheet.type === 'more' && (
              <div className="pb-8">
                <MoreOption label="Report" color="text-[#ED4956]" />
                <MoreOption label="Unfollow" color="text-[#ED4956]" />
                <MoreOption label="Add to favorites" />
                <MoreOption label="Go to post" />
                <MoreOption label="Share to..." />
                <MoreOption label="Copy link" />
                <MoreOption label="Embed" />
                <MoreOption label="About this account" />
                <MoreOption label="Cancel" onClick={() => setActiveSheet(null)} border={false} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const StoryItem = ({ label, isUser }: { label: string; isUser?: boolean }) => (
  <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
    <div className={`w-16 h-16 rounded-full flex items-center justify-center p-[2px] transition-transform group-active:scale-95 ${isUser ? 'border border-gray-500/20' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'}`}>
      <div className="w-full h-full rounded-full bg-white dark:bg-black p-[2px] overflow-hidden relative">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${label}`} alt="avatar" className="w-full h-full object-cover rounded-full" />
        {isUser && (
          <div className="absolute bottom-1 right-1 bg-blue-500 w-5 h-5 rounded-full border-2 border-white dark:border-black flex items-center justify-center">
            <i className="fa-solid fa-plus text-[10px] text-white"></i>
          </div>
        )}
      </div>
    </div>
    <span className="text-[11px] opacity-80 max-w-[64px] truncate">{label === 'Your Story' ? 'Your Story' : label}</span>
  </div>
);

const CommentItem = ({ comment }: { comment: PostComment }) => (
  <div className="flex gap-3">
    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
      <img src={comment.avatar} alt="avatar" />
    </div>
    <div className="flex-1 space-y-1">
      <div className="text-sm">
        <span className="font-bold mr-2">{comment.user}</span>
        <span className="opacity-90">{comment.text}</span>
      </div>
      <div className="flex items-center gap-4 text-[12px] opacity-40">
        <span>{comment.time}</span>
        <button className="font-bold">Reply</button>
      </div>
    </div>
    <button className="text-[12px] opacity-40 self-start mt-1">
      <i className="fa-regular fa-heart"></i>
    </button>
  </div>
);

const ShareOption = ({ icon, label }: { icon: string, label: string }) => (
  <button className="flex flex-col items-center gap-2 group active:scale-95 transition-transform">
    <div className="w-12 h-12 rounded-full border dark:border-white/10 flex items-center justify-center text-xl group-hover:bg-gray-500/5 transition-colors">
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <span className="text-[11px] opacity-70 text-center leading-tight">{label}</span>
  </button>
);

const MoreOption = ({ label, color, border = true, onClick }: { label: string, color?: string, border?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full py-3.5 text-center text-[14px] font-medium active:bg-gray-500/10 transition-colors ${color || ''} ${border ? 'border-b dark:border-white/5' : ''}`}
  >
    {label}
  </button>
);

export default Feed;
