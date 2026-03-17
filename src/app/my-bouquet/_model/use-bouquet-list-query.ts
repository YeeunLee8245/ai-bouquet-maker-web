import { useQuery } from '@tanstack/react-query';
import { fetchMyBouquetList } from '../_api/bouquet-list-api';

export const bouquetListQueryKey = ['my-bouquets'] as const;

export function useBouquetListQuery() {
  return useQuery({
    queryKey: bouquetListQueryKey,
    queryFn: () => fetchMyBouquetList(),
  });
}
