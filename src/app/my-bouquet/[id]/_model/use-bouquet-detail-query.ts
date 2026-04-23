import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchBouquetDetail } from '@api/recipe-bouquet.api';

export const bouquetDetailQueryKey = (id: string) => ['bouquet', id] as const;

export function useBouquetDetailQuery(id: string) {
  return useSuspenseQuery({
    queryKey: bouquetDetailQueryKey(id),
    queryFn: () => fetchBouquetDetail(id),
    staleTime: 1000 * 60 * 5,  // 5분 — 상세는 수정 빈도 낮음
  });
}
