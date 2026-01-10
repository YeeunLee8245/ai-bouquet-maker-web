export const tempFlowerDetailData = {
  id: '1',
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
  floweringTime: {
    season: ['봄', '여름', '가을', '겨울'],
    months: ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  },
  management: '반그늘을 좋아하며, 산성 토양에서 잘 자랍니다.',
  similarFlowers: [
    {
      id: '1',
      name: '거베라',
      imageUrl: '/temp_geobera.png',
      tags: ['사랑', '감사', '축하'],
    },
    {
      id: '2',
      name: '거베라',
      imageUrl: '/temp_geobera.png',
      tags: ['사랑', '감사', '축하'],
    },
    {
      id: '3',
      name: '거베라',
      imageUrl: '/temp_geobera.png',
      tags: ['사랑', '감사', '축하'],
    },
    {
      id: '4',
      name: '거베라',
      imageUrl: '/temp_geobera.png',
      tags: ['사랑', '감사', '축하'],
    },
    {
      id: '5',
      name: '거베라',
      imageUrl: '/temp_geobera.png',
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
