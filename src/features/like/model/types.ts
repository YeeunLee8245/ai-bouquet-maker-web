export type LikeType = 'flower';

export type LikeState = {
  liked: boolean;
  pending: boolean;
};

export type LikeKey = `${LikeType}:${string}`;
