'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFlowerDetailQuery } from '../_model/use-flower-detail-query';
import FlowerDescContainer from './flower-desc-container';
import FlowerImagesContainer from './flower-images-container';
import FlowerSimilarContainer from './flower-similar-container';
import FlowerTabContainer from './flower-tab-container';

type TProps = {
  id: string;
};

export default function FlowerDetailContent({ id }: TProps) {
  const { data } = useFlowerDetailQuery(id);
  const searchParams = useSearchParams();
  const prevPath = searchParams.get('prev-path') ?? undefined;
  const allSearchParams = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

  return (
    <div className='relative flex-1 overflow-y-auto hide-scrollbar'>
      <div className='tablet:flex tablet:flex-row tablet:items-start tablet:gap-6 pc:gap-8 tablet:px-6 pc:px-8 tablet:py-6 pc:py-8'>
        <FlowerImagesContainer images={data.images} prevPath={prevPath} />
        <FlowerDescContainer
          id={data.id}
          title={data.title}
          description={data.description}
          isLiked={data.isLiked}
        />
      </div>
      <FlowerTabContainer
        meanings={data.meanings}
        floweringTimes={data.floweringTimes}
        management={data.management}
      />
      <div className='w-full h-micro bg-gray-100' />
      <FlowerSimilarContainer similarFlowers={data.similarFlowers} searchParams={allSearchParams} replace={!!prevPath} />
    </div>
  );
}
