export type TMakeBouquetInfoData = {
  title: string;
  placeholder: string;
  isRequired: boolean;
};

export type TFlowerColorInfo = {
  hex: string;
  quantity: number;
  meaningId: string;
  tags: string[];
};

export type TFlowerCompositionItem = {
  id: string;
  name: string;
  meaningId: string;
  keywords: string[];
  imageUrl: string;
  colorInfos: TFlowerColorInfo[];
};

/**
 * initBouquetFormFromDetailAtom에 필요한 detail 데이터 구조.
 * BouquetDetailData와 구조적으로 호환되며, features → app 의존성 없이 독립 정의.
 */
export type TBouquetDetailInitData = {
  name: string;
  occasion: string | null;
  recipient: string | null;
  message: string | null;
  flowers: Array<{
    flower_id: string;
    flower_name: string;
    tags: string[];
    color_and_quantity: Array<{ color: string; quantity: number; meaningId?: string | null }>;
  }>;
  wrapping: {
    wrappingColor: string | null;
    ribbonColor: string | null;
  };
};
