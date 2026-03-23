import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchFlowerDetail } from '@api/flowers.api';
import { TFlowerDetail } from '../_types';

export const flowerDetailQueryKey = (id: string) => ['flower', id] as const;

export function useFlowerDetailQuery(id: string, options?: Omit<UseQueryOptions<TFlowerDetail, Error>, 'queryKey' | 'queryFn' | 'enabled'>) {
  return useQuery({
    queryKey: flowerDetailQueryKey(id),
    queryFn: () => fetchFlowerDetail(id),
    enabled: !!id,
    ...options,
  });
}
