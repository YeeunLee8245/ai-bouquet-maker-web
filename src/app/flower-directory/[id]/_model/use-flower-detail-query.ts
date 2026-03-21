import { useQuery } from '@tanstack/react-query';
import { fetchFlowerDetail } from '@api/flowers.api';

export const flowerDetailQueryKey = (id: string) => ['flower', id] as const;

export function useFlowerDetailQuery(id: string) {
  return useQuery({
    queryKey: flowerDetailQueryKey(id),
    queryFn: () => fetchFlowerDetail(id),
    enabled: !!id,
  });
}
