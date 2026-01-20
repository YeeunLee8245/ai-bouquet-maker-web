import { TFlowerCompositionItem, TMakeBouquetInfoData } from '../_types';

export const MAKE_BOUQUET_INFO_DATAS: TMakeBouquetInfoData[] = [
  {
    title: '꽃다발 이름',
    placeholder: '꽃다발 이름을 입력해주세요.',
    isRequired: true,
  },
  {
    title: '상황',
    placeholder: '상황을 입력해주세요.',
    isRequired: false,
  },
  {
    title: '받는 사람',
    placeholder: '받는 사람을 입력해주세요.',
    isRequired: false,
  },
  {
    title: '전달 메시지',
    placeholder: '전달할 메시지를 입력해주세요.',
    isRequired: false,
  },
];

export const FLOWER_COMPOSITION_ITEMS: TFlowerCompositionItem[] = [
  {
    id: 1,
    name: '리시안셔스',
    keywords: ['행복', '감사', '축하'],
    imageUrl: '/temp_geobera.png',
    colorAndQuantities: [
      {
        // 주황
        color: '#FF8D3E',
        quantity: 1,
      },
      {
        // 초록
        color: '#00C240',
        quantity: 1,
      },
    ],
  },
];
