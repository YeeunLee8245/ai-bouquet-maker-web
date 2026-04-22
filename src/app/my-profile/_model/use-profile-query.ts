import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchMyProfile } from '@api/my.api';

export const profileQueryKey = ['my-profile'] as const;

export function useProfileQuery() {
  return useSuspenseQuery({
    queryKey: profileQueryKey,
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60 * 5,  // 5분 — 프로필은 자주 바뀌지 않음
  });
}
