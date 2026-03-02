import { fetcher } from '@/shared/lib/axios';

// ── Types ──

export type TSelectedFlowerDetail = {
  id: string;
  name_ko: string;
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
      flower_id: number;
      flower_meaning_id: number;
      quantity: number;
      color: string;
    }[];
  };
};

type TBouquetSaveResponse = {
  success: boolean;
  data: { id: string };
};

// ── API ──

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
