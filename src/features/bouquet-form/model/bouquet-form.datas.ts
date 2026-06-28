import type { TMakeBouquetInfoData } from './bouquet-form.types';

export const MAKE_BOUQUET_INFO_DATAS: TMakeBouquetInfoData[] = [
  { title: '꽃다발 이름', placeholder: '꽃다발 이름을 입력해주세요.', isRequired: true },
  { title: '상황', placeholder: '상황을 입력해주세요.', isRequired: false },
  { title: '받는 사람', placeholder: '받는 사람을 입력해주세요.', isRequired: false },
  { title: '전달 메시지', placeholder: '전달할 메시지를 입력해주세요.', isRequired: false },
];

export const MAKE_BOUQUET_PACKAGING_DEFAULT_COLORS: string[] = [
  '#F4C2C2',
  '#FADADD',
  '#FDE8D0',
  '#FFFACD',
  '#D5F0D0',
  '#C5D8F0',
  '#D8CCE8',
  '#FFFFFF',
];
