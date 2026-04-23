export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createServerQueryClient } from '@/shared/lib/server-query';
import { serverFetchJson } from '@/shared/api/server-fetch';
import { profileQueryKey } from './_model/use-profile-query';
import ProfileSkeleton from './_ui/profile-skeleton';
import ProfilePageContent from './_ui/profile-page-content';
import type { ProfileResponse } from './_types';

export default async function MyProfilePage() {
  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: profileQueryKey,
    queryFn: () => serverFetchJson<ProfileResponse>('/api/my/profile'),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilePageContent ProfileFallback={<ProfileSkeleton />} />
    </HydrationBoundary>
  );
}
