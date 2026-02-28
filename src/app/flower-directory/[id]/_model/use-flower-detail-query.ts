import { useQuery } from '@tanstack/react-query';
import { fetchFlowerDetail } from '../_api/flower-detail-api';

export const flowerDetailQueryKey = (id: string) => ['flower', id] as const;

export function useFlowerDetailQuery(id: string) {
  return useQuery({
    queryKey: flowerDetailQueryKey(id),
    queryFn: () => fetchFlowerDetail(id),
    enabled: !!id,
  });
}
