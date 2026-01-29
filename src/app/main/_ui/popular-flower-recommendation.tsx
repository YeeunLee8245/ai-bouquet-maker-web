import React from 'react';
import { POPULAR_FLOWER_RECOMMENDATION_LIST } from '../_datas';
import { FlowerCard } from '@/entities/flower/ui';

export default function PopularFlowerRecommendation() {
  return (
    <div className='flex flex-col gap-3 px-4 pt-4 pb-5 border-t-2 border-gray-100'>
      <p className='text-title-md'>인기 꽃 추천</p>
      <div className='flex gap-2 overflow-x-auto'>
        {POPULAR_FLOWER_RECOMMENDATION_LIST.map((item) => (
          <FlowerCard key={item.id} {...item} size='md' />
        ))}
      </div>
    </div>
  );
}
