import { fetcher } from '@/shared/lib/axios';

// ── Types ──

export type TLikedFlower = {
  flower_id: string;
  name_ko: string;
};

type TLikedFlowersResponse = {
  flowers: TLikedFlower[];
  total_count: number;
};

export type TSelectedFlowerDetail = {
  id: string;
  name_ko: string;
  defaultMeaningId: string;
  tags: string[];
  imageUrl: string | null;
  colors: string[];
};

export type TBouquetSavePayload = {
  name: string;
  occasion?: string;
  recipient?: string;
  message?: string;
  recipe: {
    flowers: {
      flower_id: string;
      flower_meaning_id: string;
      quantity: number;
      color: string;
    }[];
    wrapping: {
      ribbonColor: string;
      wrappingColor: string;
    };
  };
};

type TBouquetSaveResponse = {
  success: boolean;
  data: { id: string };
};

// ── API ──

/** 내가 좋아요한 꽃 목록 조회 */
export const fetchLikedFlowers = async (): Promise<TLikedFlower[]> => {
  const { data } = await fetcher.get<TLikedFlowersResponse>('/api/my/liked-flowers');
  return data.flowers;
};

/** 선택한 꽃 ID 배열로 꽃 상세 정보 조회 */
export const fetchSelectedFlowers = async (ids: number[]): Promise<TSelectedFlowerDetail[]> => {
  const { data } = await fetcher.post<TSelectedFlowerDetail[]>(
    '/api/recipe/bouquet/selected',
    ids,
  );
  return data;
};

/** 꽃다발 레시피 저장 */
export const saveBouquet = async (payload: TBouquetSavePayload): Promise<TBouquetSaveResponse> => {
  const { data } = await fetcher.post<TBouquetSaveResponse>(
    '/api/recipe/bouquet',
    payload,
  );
  return data;
};
