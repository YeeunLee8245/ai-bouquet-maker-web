import { useMutation } from '@tanstack/react-query';
import { deleteBouquet } from '@api/recipe-bouquet.api';

export function useDeleteBouquetMutation(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (id: string) => deleteBouquet(id),
    onSuccess,
  });
}
