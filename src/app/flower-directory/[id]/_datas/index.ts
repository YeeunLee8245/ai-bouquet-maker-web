export const tempFlowerDetailData = {
  title: {
    ko: '거베라',
    en: 'Gerbera / Gerbera jamesonii',
  },
  description: '밝고 선명한 색상의 데이지 모양 꽃',
  isLiked: true,
  images: [
    {
      url: '/temp_tulip.png',
      name: 'Image 1',
    },
    {
      url: '/temp_geobera.png',
      name: 'Image 2',
    },
  ],
};

export const flowerTabItems = [
  {
    value: '1',
    label: '꽃말',
  },
  {
    value: '2',
    label: '개화시기',
  },
  {
    value: '3',
    label: '관리법',
  },
] as const;
