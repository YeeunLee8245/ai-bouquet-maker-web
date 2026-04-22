import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchMyBouquetList } from '@api/recipe-bouquet.api';

export const bouquetListQueryKey = ['my-bouquets'] as const;

export function useBouquetListQuery() {
  return useSuspenseQuery({
    queryKey: bouquetListQueryKey,
    queryFn: () => fetchMyBouquetList(),
    staleTime: 0,  // 목록은 생성/삭제로 자주 변경 — 마운트 시 항상 refetch
  });
}
