import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createServerQueryClient } from '@/shared/lib/server-query';
import { serverFetchJson } from '@/shared/api/server-fetch';
import { bouquetListQueryKey } from './_model/use-bouquet-list-query';
import BouquetListSkeleton from './_ui/bouquet-list-skeleton';
import BouquetListContent from './_ui/bouquet-list-content';
import type { IBouquetListResponse } from './_types';

export default async function MyBouquetPage() {
  const queryClient = createServerQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: bouquetListQueryKey,
      queryFn: async () => {
        const res = await serverFetchJson<IBouquetListResponse>(
          '/api/recipe/bouquet/list?my_only=true&page=1&limit=10',
        );
        return res.data;
      },
    });
  } catch {
    // 빌드 타임 또는 미인증 상태에서 prefetch 실패 시 무시 — 클라이언트에서 Suspense로 처리
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<BouquetListSkeleton />}>
        <BouquetListContent />
      </Suspense>
    </HydrationBoundary>
  );
}
