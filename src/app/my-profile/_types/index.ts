export type ProfileData = {
  id: string;
  nickname: string;
  email: string;
  bio: string;
  created_at: string;
  avatar_url: string | null;
};

export type ProfileStats = {
  favorite_flowers: string[];
  recent_bouquet: { name: string; recipe: unknown } | null;
  recommendation_count: number;
};

export type ProfileResponse = {
  profile: ProfileData;
  stats: ProfileStats;
};

export type UpdateProfileParams = {
  nickname?: string;
  bio?: string;
};

export type UpdateProfileResponse = {
  success: boolean;
  profile: ProfileData;
};
