export type TMakeBouquetInfoData = {
  title: string;
  placeholder: string;
  /**
   * 필수 입력 여부
   */
  isRequired: boolean;
};

/**
 * 꽃 색상과 개수
 */
export type TFlowerColorAndQuantity = {
  color: string;
  quantity: number;
};

export type TFlowerCompositionItem = {
  id: number;
  name: string;
  keywords: string[];
  imageUrl: string;
  colorAndQuantities: TFlowerColorAndQuantity[];
};
