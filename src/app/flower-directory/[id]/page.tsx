'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useFlowerDetailQuery } from './_model/use-flower-detail-query';
import FlowerDescContainer from './_ui/flower-desc-container';
import FlowerImagesContainer from './_ui/flower-images-container';
import FlowerSimilarContainer from './_ui/flower-similar-container';
import FlowerTabContainer from './_ui/flower-tab-container';
import { useMemo } from 'react';

/**
 * 꽃 사전 상세 페이지
 */
function FlowerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const prevPath = searchParams.get('prev-path') ?? undefined;
  const { data, isLoading, isError } = useFlowerDetailQuery(id);

  // searchParams 전체 반환 값
  const allSearchParams = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

  if (isLoading) {
    return <div className='flex flex-1 items-center justify-center'>로딩 중...</div>;
  }

  if (isError || !data) {
    return <div className='flex flex-1 items-center justify-center'>꽃 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className='relative flex-1 overflow-y-auto hide-scrollbar'>
      <FlowerImagesContainer images={data.images} prevPath={prevPath} />
      <FlowerDescContainer
        id={data.id}
        title={data.title}
        description={data.description}
        isLiked={data.isLiked}
      />
      <FlowerTabContainer
        meanings={data.meanings}
        floweringTimes={data.floweringTimes}
        management={data.management}
      />
      <div className='w-full h-micro bg-gray-100' />
      <FlowerSimilarContainer similarFlowers={data.similarFlowers} searchParams={allSearchParams} />
    </div>
  );
}

export default FlowerDetailPage;
