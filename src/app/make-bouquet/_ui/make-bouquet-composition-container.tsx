'use client';

import { Button } from '@/shared/ui/button';
import React from 'react';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import FlowerCompositionItem from './flower-composition-item';
import { openModalAtom } from '@/shared/model/modal';
import { useAtomValue, useSetAtom } from 'jotai';
import FlowerAddModal from './modals/flower-add-modal/flower-add-modal';
import { showToastAtom } from '@/shared/model/toast';
import {
  bouquetFlowersAtom,
  removeBouquetFlowerAtom,
  removeFlowerColorAtom,
  plusFlowerColorQuantityAtom,
  minusFlowerColorQuantityAtom,
  addFlowerColorAtom,
  updateFlowerColorAtom,
} from '../_model';

export default function MakeBouquetCompositionContainer() {
  const openModal = useSetAtom(openModalAtom);
  const showToast = useSetAtom(showToastAtom);
  const flowers = useAtomValue(bouquetFlowersAtom);
  const removeFlower = useSetAtom(removeBouquetFlowerAtom);
  const removeColor = useSetAtom(removeFlowerColorAtom);
  const plusQuantity = useSetAtom(plusFlowerColorQuantityAtom);
  const minusQuantity = useSetAtom(minusFlowerColorQuantityAtom);
  const addColor = useSetAtom(addFlowerColorAtom);
  const updateColor = useSetAtom(updateFlowerColorAtom);

  const handleDelete = (flowerIndex: number) => {
    if (flowers.length <= 1) {
      showToast({ message: '한 개 이상의 꽃을 추가해 주세요.' });
      return;
    }
    removeFlower(flowerIndex);
  };

  const handleDeleteColor = (flowerIndex: number, colorIndex: number) => {
    removeColor({ flowerIndex, colorIndex });
  };

  const handlePlusColor = (flowerIndex: number, colorIndex: number) => {
    plusQuantity({ flowerIndex, colorIndex });
  };

  const handleMinusColor = (flowerIndex: number, colorIndex: number) => {
    minusQuantity({ flowerIndex, colorIndex });
  };

  const handleAddColor = (flowerIndex: number, color: string) => {
    addColor({ flowerIndex, color });
  };

  const handleUpdateColor = (flowerIndex: number, colorIndex: number, color: string) => {
    updateColor({ flowerIndex, colorIndex, color });
  };

  const handleAddFlower = () => {
    openModal({
      id: 'flower-add-modal',
      component: <FlowerAddModal />,
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
        {flowers.map((item, idx) => (
          <div key={item.flowerId}>
            <FlowerCompositionItem
              item={item}
              flowerIndex={idx}
              onDelete={handleDelete}
              onDeleteColor={handleDeleteColor}
              onPlusColor={handlePlusColor}
              onMinusColor={handleMinusColor}
              onAddColor={handleAddColor}
              onUpdateColor={handleUpdateColor}
            />
            {idx !== flowers.length - 1 && <div className='my-4 w-full h-[1px] bg-gray-100'/>}
          </div>
        ))}
      </div>
    </div>
  );
}
