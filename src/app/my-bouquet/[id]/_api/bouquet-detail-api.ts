import { fetcher } from '@/shared/lib/axios';
import type { BouquetDetailData, BouquetDetailResponse } from '../_types';

export async function fetchBouquetDetail(id: string): Promise<BouquetDetailData> {
  const { data } = await fetcher.get<BouquetDetailResponse>(
    `/api/recipe/bouquet/${id}`,
  );
  return data.data;
}
