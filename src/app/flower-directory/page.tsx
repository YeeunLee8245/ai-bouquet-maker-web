export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createServerQueryClient } from '@/shared/lib/server-query';
import { queryDirectory } from '@/lib/flowers/query-directory';
import { directoryQueryKey, directoryDefaultQueryParams } from './_model/use-directory-query';
import DirectoryPageContent from './_ui/directory-page-content';

/**
 * 꽃 사전 리스트 페이지
 */
export default async function FlowerDirectoryPage() {
  const queryClient = createServerQueryClient();

  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: directoryQueryKey(directoryDefaultQueryParams),
      queryFn: ({ pageParam }) => queryDirectory({
        sort: directoryDefaultQueryParams.sort,
        page: pageParam,
        limit: 20,
      }),
      initialPageParam: 1,
    });
  } catch {
    // prefetch 실패 시 클라이언트에서 Suspense로 처리
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DirectoryPageContent />
    </HydrationBoundary>
  );
}
