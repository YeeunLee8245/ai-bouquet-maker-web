import { useQuery } from '@tanstack/react-query';
import { fetchMyProfile } from '../_api/profile-api';

export const profileQueryKey = ['my-profile'] as const;

export function useProfileQuery() {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: fetchMyProfile,
  });
}
