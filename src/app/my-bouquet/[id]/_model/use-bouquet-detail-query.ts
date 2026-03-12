import { useQuery } from '@tanstack/react-query';
import { fetchBouquetDetail } from '../_api/bouquet-detail-api';

export const bouquetDetailQueryKey = (id: string) => ['bouquet', id] as const;

export function useBouquetDetailQuery(id: string) {
  return useQuery({
    queryKey: bouquetDetailQueryKey(id),
    queryFn: () => fetchBouquetDetail(id),
    enabled: !!id,
  });
}
