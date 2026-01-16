'use client';

import { initLikeFromServer } from '@/features/like/model/atoms';
import LikeButton from '@/features/like/ui/LikeButton';
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
    <div className='flex flex-col px-4 py-4'>
      <div className='flex items-center justify-between'>
        <span className='text-title-lg'>{ko}</span>
        <LikeButton type='flower' id={id} variant='fill' size='lg'
          queryKeyToPatch={queryKey}
          patchQueryData={patchQueryData}
          className='p-[2.6px, 2px, 3.4px, 2px]'
        />
      </div>
      <p className='text-body-md text-gray-400'>{en}</p>
      <p className='text-body-sm mt-2 text-gray-400'>{description}</p>
    </div>
  );
}

export default FlowerDescContainer;
