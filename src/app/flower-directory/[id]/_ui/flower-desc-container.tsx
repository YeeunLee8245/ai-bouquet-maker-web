'use client';

import { initLikeFromServer } from '@/features/like/model/atoms';
import LikeButton from '@/features/like/ui/like-button';
import { useStore } from 'jotai';
import React, { useEffect } from 'react';

type TProps = {
  id: string;
  title: {
    ko: string;
    en: string;
  };
  description: string;
  isLiked: boolean;
};

function FlowerDescContainer({ id, title, description, isLiked }: TProps) {
  const store = useStore();
  const { ko, en } = title;
  const queryKey = ['flower', id];

  useEffect(() => {
    initLikeFromServer({store, liked: isLiked, id, type: 'flower'});
  }, [isLiked, id, store]);

  const patchQueryData = (prev: unknown, newLiked: boolean) => {
    return {
      ...(prev as Record<string, unknown>),
      isLiked: newLiked,
    };
  };

  return (
    <div className='flex flex-col px-4 py-4 tablet:px-0 tablet:py-0 tablet:flex-1 tablet:pt-4 tablet:gap-4'>
      {/* tablet/pc: LikeButton 상단 */}
      <LikeButton type='flower' id={id} variant='fill' size='lg'
        queryKeyToPatch={queryKey}
        patchQueryData={patchQueryData}
        className='hidden tablet:block p-[2.6px, 2px, 3.4px, 2px]'
      />
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col gap-[2px]'>
          <div className='flex items-center justify-between'>
            <span className='text-title-lg'>{ko}</span>
            {/* mobile: LikeButton 제목 우측 */}
            <LikeButton type='flower' id={id} variant='fill' size='lg'
              queryKeyToPatch={queryKey}
              patchQueryData={patchQueryData}
              className='tablet:hidden p-[2.6px, 2px, 3.4px, 2px]'
            />
          </div>
          <p className='text-body-md text-gray-400'>{en}</p>
        </div>
        <p className='text-body-sm text-gray-400'>{description}</p>
      </div>
    </div>
  );
}

export default FlowerDescContainer;
