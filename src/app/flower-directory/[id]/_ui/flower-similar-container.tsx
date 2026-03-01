import { FlowerCard } from '@/entities/flower/ui';
import React from 'react';

type TProps = {
  similarFlowers: {
    id: string;
    name: string;
    imageUrl: string;
    tags: string[];
  }[];
  searchParams?: Record<string, string>;
};

function FlowerSimilarContainer({ similarFlowers, searchParams }: TProps) {
  return (
    <div className='w-full pt-4 pb-5'>
      <p className='text-title-md px-4'>유사한 꽃</p>
      <div className='mt-3 flex gap-2 overflow-x-scroll'>
        {similarFlowers.map((flower) => (
          <FlowerCard
            key={flower.id}
            size='md'
            {...flower}
            searchParams={searchParams}
            className='first:ml-4 last:mr-4'
          />
        ))}
      </div>
    </div>
  );
}

export default FlowerSimilarContainer;
