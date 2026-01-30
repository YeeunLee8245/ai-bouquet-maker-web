'use client';

import { Button } from '@/shared/ui/button';
import React from 'react';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import { FLOWER_COMPOSITION_ITEMS } from '../_datas';
import FlowerCompositionItem from './flower-composition-item';
import { openModalAtom } from '@/shared/model/modal';
import { useSetAtom } from 'jotai';
import FlowerAddModal from './modals/flower-add-modal/flower-add-modal';

export default function MakeBouquetCompositionContainer() {
  const openModal = useSetAtom(openModalAtom);

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

  const handleAddFlower = () => {
    openModal({
      id: 'flower-add-modal',
      component: <FlowerAddModal />,
      position: 'bottom',
    });
  };

  return (
    <div className='relative mt-4 p-4 border-1 border-gray-100 rounded-5 bg-white'>
      <div className='flex justify-between'>
        <p className='text-title-md'>꽃 구성</p>
        <Button size='sm' className='pl-1' onClick={handleAddFlower}>
          <span className='mx-[3.5px]'>
            <PlusIcon className='w-[13px] h-[13px]' />
          </span>
          <span className='text-ui-cta-sm'>꽃 추가</span>
        </Button>
      </div>
      <div className='mt-3 flex flex-col'>
        {FLOWER_COMPOSITION_ITEMS.map((item, idx) => (
          <div key={item.id}>
            <FlowerCompositionItem
              item={item}
              onDelete={handleDelete}
              onDeleteColor={handleDeleteColor}
              onPlusColor={handlePlusColor}
              onMinusColor={handleMinusColor}
            />
            {idx !== FLOWER_COMPOSITION_ITEMS.length - 1 && <div className='my-4 w-full h-[1px] bg-gray-100'/>}
          </div>
        ))}
      </div>
    </div>
  );
}
