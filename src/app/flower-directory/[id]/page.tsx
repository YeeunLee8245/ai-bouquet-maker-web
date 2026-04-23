import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createServerQueryClient } from '@/shared/lib/server-query';
import { fetchFlowerDetail } from '@api/flowers.api';
import { flowerDetailQueryKey } from './_model/use-flower-detail-query';
import FlowerDetailSkeleton from './_ui/flower-detail-skeleton';
import FlowerDetailContent from './_ui/flower-detail-content';

type TProps = {
  params: Promise<{ id: string }>;
};

/**
 * 꽃 사전 상세 페이지
 */
export default async function FlowerDetailPage({ params }: TProps) {
  const { id } = await params;
  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: flowerDetailQueryKey(id),
    queryFn: () => fetchFlowerDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<FlowerDetailSkeleton />}>
        <FlowerDetailContent id={id} />
      </Suspense>
    </HydrationBoundary>
  );
}
