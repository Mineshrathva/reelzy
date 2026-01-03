
export interface Reel {
  id: string;
  url: string;
  title: string;
  author: string;
  likes: number;
  comments: number;
  description: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export type AppView = 'feed' | 'explore' | 'create' | 'reels' | 'assistant' | 'profile' | 'activity' | 'messages';

export interface GeneratedAsset {
  id: string;
  type: 'video' | 'image';
  url: string;
  prompt: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  posts: number;
  followers: string;
  following: number;
}

export interface PostComment {
  id: string;
  user: string;
  text: string;
  time: string;
  avatar: string;
}
