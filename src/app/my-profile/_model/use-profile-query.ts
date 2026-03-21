import { useQuery } from '@tanstack/react-query';
import { fetchMyProfile } from '@api/my.api';

export const profileQueryKey = ['my-profile'] as const;

export function useProfileQuery() {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: fetchMyProfile,
  });
}
