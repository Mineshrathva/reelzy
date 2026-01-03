
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

export type AppView = 'feed' | 'explore' | 'create' | 'studio' | 'assistant' | 'profile';

export interface GeneratedAsset {
  id: string;
  type: 'video' | 'image';
  url: string;
  prompt: string;
  timestamp: number;
}
