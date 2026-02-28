import { ProfileData, ProfileStats } from '../_types';

export const getMyProfileDescriptionFields = (profile: ProfileData) => [
  { id: 'nickname', label: '닉네임', value: profile.nickname },
  { id: 'email', label: '이메일', value: profile.email },
  { id: 'bio', label: '소개', value: profile.bio },
  { id: 'createdAt', label: '가입일', value: new Date(profile.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) },
];

export const getMyProfileBouquetData = (stats: ProfileStats) => [
  {
    id: 'favoriteBouquet',
    canClick: false,
    label: '좋아하는 꽃',
    content: stats.favorite_flowers.length > 0
      ? stats.favorite_flowers.join(', ')
      : '아직 좋아요한 꽃이 없어요.',
  },
  {
    id: 'recentBouquet',
    canClick: true,
    label: '최근 꽃다발',
    content: stats.recent_bouquet
      ? stats.recent_bouquet.name
      : '아직 만든 꽃다발이 없어요.',
  },
  {
    id: 'recommendationCount',
    canClick: false,
    label: '추천 통계',
    content: `총 ${stats.recommendation_count}번의 꽃 추천을 받았어요.`,
  },
];
