
export interface InstagramProfile {
  id: string;
  url: string;
  fullName: string;
  username: string;
  biography: string;
  followersCount: number;
  isVerified: boolean;
  niche: string;
  hasPostedRecently: boolean;
  lastPostDate?: string;
  profilePicUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface ScrapingStats {
  total: number;
  processed: number;
  verifiedCount: number;
  avgFollowers: number;
  activeLast30Days: number;
}

export interface ApifyConfig {
  apiKey: string;
  actorId: string;
}
