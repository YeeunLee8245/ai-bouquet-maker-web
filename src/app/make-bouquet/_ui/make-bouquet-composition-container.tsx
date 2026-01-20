'use client';

import { Button } from '@/shared/ui/button';
import React from 'react';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import { FLOWER_COMPOSITION_ITEMS } from '../_datas';
import FlowerCompositionItem from './flower-composition-item';

export default function MakeBouquetCompositionContainer() {
  const handleDelete = (id: number) => {
    console.log('delete id: ', id);
  };

  const handleDeleteColor = (color: string) => {
    console.log('delete color: ', color);
  };

  const handlePlusColor = (color: string) => {
    console.log('plus color: ', color);
  };

  const handleMinusColor = (color: string) => {
    console.log('minus color: ', color);
  };

  return (
    <div className='relative mt-4 p-4 border-1 border-gray-100 rounded-5 bg-white'>
      <div className='flex justify-between'>
        <p className='text-title-md'>꽃 구성</p>
        <Button size='sm' className='pl-1'>
          <span className='mx-[3.5px]'>
            <PlusIcon className='w-[13px] h-[13px]' />
          </span>
          <span className='text-ui-cta-sm'>꽃 추가</span>
        </Button>
      </div>
      <div className='mt-3 flex flex-col'>
        {FLOWER_COMPOSITION_ITEMS.map((item) => (
          <FlowerCompositionItem
            key={item.id}
            item={item}
            onDelete={handleDelete}
            onDeleteColor={handleDeleteColor}
            onPlusColor={handlePlusColor}
            onMinusColor={handleMinusColor}
          />
        ))}
      </div>
    </div>
  );
}
