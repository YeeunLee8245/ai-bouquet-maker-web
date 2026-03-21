import { useMutation } from '@tanstack/react-query';
import { deleteBouquet } from '../_api/bouquet-list-api';

export function useDeleteBouquetMutation(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (id: string) => deleteBouquet(id),
    onSuccess,
  });
}
