import { useQuery } from '@tanstack/react-query';
import { fetchMyBouquetList } from '@api/recipe-bouquet.api';

export const bouquetListQueryKey = ['my-bouquets'] as const;

export function useBouquetListQuery() {
  return useQuery({
    queryKey: bouquetListQueryKey,
    queryFn: () => fetchMyBouquetList(),
  });
}
