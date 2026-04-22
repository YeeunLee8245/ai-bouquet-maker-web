import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createServerQueryClient } from '@/shared/lib/server-query';
import { serverFetchJson } from '@/shared/api/server-fetch';
import { bouquetDetailQueryKey } from './_model/use-bouquet-detail-query';
import BouquetDetailSkeleton from './_ui/bouquet-detail-skeleton';
import BouquetDetailContent from './_ui/bouquet-detail-content';
import type { IBouquetDetailResponse } from './_types';

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function MyBouquetDetailPage({ params }: TProps) {
  const { id } = await params;
  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: bouquetDetailQueryKey(id),
    queryFn: async () => {
      const res = await serverFetchJson<IBouquetDetailResponse>(`/api/recipe/bouquet/${id}`);
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<BouquetDetailSkeleton />}>
        <BouquetDetailContent id={id} />
      </Suspense>
    </HydrationBoundary>
  );
}
