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
  meanings: [
    {
      color: '#FF0000',
      description: '어버이에 대한 사랑과 존경',
      tags: ['사랑', '감사', '축하'],
    },
    {
      color: '#00FF00',
      description: '축하와 소중함을 전달하는 꽃',
      tags: ['사랑', '감사', '축하'],
    },
    {
      color: '#0000FF',
      description: '신비와 영감을 주는 꽃',
      tags: ['사랑', '감사', '축하'],
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
