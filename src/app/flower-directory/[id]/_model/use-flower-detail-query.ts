import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchFlowerDetail } from '@api/flowers.api';
import { TFlowerDetail } from '../_types';

export const flowerDetailQueryKey = (id: string) => ['flower', id] as const;

export function useFlowerDetailQuery(id: string) {
  return useSuspenseQuery<TFlowerDetail>({
    queryKey: flowerDetailQueryKey(id),
    queryFn: () => fetchFlowerDetail(id),
    staleTime: Infinity,  // 꽃 정보는 거의 바뀌지 않는 데이터
    gcTime: 1000 * 60 * 30, // 30분 — 사전 탐색 중 뒤로가기 시 캐시 유지
  });
}
