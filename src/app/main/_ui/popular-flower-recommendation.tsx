import React from 'react';
import { POPULAR_FLOWER_RECOMMENDATION_LIST } from '../_datas';
import { TPopularFlower } from '../_types';
import { FlowerCard } from '@/entities/flower/ui';

type TProps = {
  flowers?: TPopularFlower[];
};

export default function PopularFlowerRecommendation({ flowers }: TProps) {
  const items = flowers
    ? flowers.map((f) => ({
      id: String(f.id),
      name: f.name_ko,
      imageUrl: f.image_url,
      tags: f.representative_meanings,
    }))
    : POPULAR_FLOWER_RECOMMENDATION_LIST;

  return (
    <div className='flex flex-col gap-3 pt-4 pb-5 border-t-2 border-gray-100'>
      <p className='text-title-md px-4'>인기 꽃 추천</p>
      <div className='flex gap-2 overflow-x-auto'>
        {items.map((item) => (
          <FlowerCard key={item.id} priority {...item} size='md' className='first:ml-4 last:mr-4' />
        ))}
      </div>
    </div>
  );
}
