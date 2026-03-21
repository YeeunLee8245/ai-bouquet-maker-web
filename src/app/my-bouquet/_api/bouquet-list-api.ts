import { fetcher } from '@/shared/lib/axios';
import type { BouquetListData, BouquetListResponse } from '../_types';

export async function fetchMyBouquetList(page = 1, limit = 10): Promise<BouquetListData> {
  const { data } = await fetcher.get<BouquetListResponse>('/api/recipe/bouquet/list', {
    params: { my_only: true, page, limit },
  });
  return data.data;
}

export async function deleteBouquet(id: string): Promise<void> {
  await fetcher.delete(`/api/recipe/bouquet/${id}`);
}
