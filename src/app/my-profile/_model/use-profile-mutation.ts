import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMyProfile } from '../_api/profile-api';
import { profileQueryKey } from './use-profile-query';
import type { UpdateProfileParams } from '../_types';

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateProfileParams) => updateMyProfile(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey });
    },
    onError: (error) => {
      console.error('[My Profile] Update Error:', error);
    },
  });
}
