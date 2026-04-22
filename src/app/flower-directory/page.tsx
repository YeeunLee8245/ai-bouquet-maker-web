export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createServerQueryClient } from '@/shared/lib/server-query';
import { fetchDirectory } from '@api/flowers.api';
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
      queryFn: ({ pageParam }) => fetchDirectory({
        ...directoryDefaultQueryParams,
        search: undefined,
        page: pageParam,
        limit: 20,
      }),
      initialPageParam: 1,
    });
  } catch {
    // 빌드 타임 또는 미인증 상태에서 prefetch 실패 시 무시 — 클라이언트에서 Suspense로 처리
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DirectoryPageContent />
    </HydrationBoundary>
  );
}
