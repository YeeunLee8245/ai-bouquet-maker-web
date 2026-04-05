export const DIRECTORY_COLOR_NAME_MAP = {
  red: ['빨강', '#A1262C'],
  orange: ['주황', '#FF8D3E'],
  yellow: ['노랑', '#FFE000'],
  green: ['초록', '#00C240'],
  blue: ['파랑', '#3359DC'],
  pink: ['분홍', '#FFB6C1'],
  purple: ['보라', '#9B59B6'],
  white: ['흰색', '#FFFFFF'],
} as const;

export type TDirectoryColorName = (typeof DIRECTORY_COLOR_NAME_MAP)[keyof typeof DIRECTORY_COLOR_NAME_MAP][0];

// [{id: 'red', name: '빨강'}...] 형태의 배열로 변환
export const DIRECTORY_COLOR_LIST = Object.keys(DIRECTORY_COLOR_NAME_MAP).map((key) => ({
  id: key as keyof typeof DIRECTORY_COLOR_NAME_MAP,
  name: DIRECTORY_COLOR_NAME_MAP[key as keyof typeof DIRECTORY_COLOR_NAME_MAP][0],
  colorHex: DIRECTORY_COLOR_NAME_MAP[key as keyof typeof DIRECTORY_COLOR_NAME_MAP][1],
}));

export const DIRECTORY_SEASON_NAME_MAP = {
  spring: '봄',
  summer: '여름',
  autumn: '가을',
  winter: '겨울',
} as const;

export type TDirectorySeasonName = (typeof DIRECTORY_SEASON_NAME_MAP)[keyof typeof DIRECTORY_SEASON_NAME_MAP];

// [{id: 'spring', name: '봄'}...] 형태의 배열로 변환
export const DIRECTORY_SEASON_LIST = Object.keys(DIRECTORY_SEASON_NAME_MAP).map((key) => ({
  id: key as keyof typeof DIRECTORY_SEASON_NAME_MAP,
  name: DIRECTORY_SEASON_NAME_MAP[key as keyof typeof DIRECTORY_SEASON_NAME_MAP],
}));

export const directoryDefaultSelectedColors = [];
export const directoryDefaultSelectedSeasons = [];

export const directoryDefaultSortOptions = [
  {
    id: 'popular',
    name: '인기순',
  },
  {
    id: 'name',
    name: '이름순',
  },
] as const;

export const testDirectoryItem =
  {
    id: '1',
    imageUrl: '/temp_tulip.png',
    name: '튤립',
    isLiked: false,
    colors: ['#FF0000', '#FF8E3E', '#FFD700'],
    tags: ['희망', '사랑', '감사'],
  };
