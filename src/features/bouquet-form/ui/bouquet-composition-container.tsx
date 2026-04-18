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
  removeFlowerColorAtom,
  plusFlowerColorQuantityAtom,
  minusFlowerColorQuantityAtom,
  addFlowerColorAtom,
  updateFlowerColorAtom,
  removeBouquetFlowerByIdAtom,
} from '../model';

export default function BouquetCompositionContainer() {
  const flowers = useAtomValue(bouquetFlowersAtom);
  // -- Action Atoms --
  const openModal = useSetAtom(openModalAtom);
  const showToast = useSetAtom(showToastAtom);
  const removeFlower = useSetAtom(removeBouquetFlowerByIdAtom);
  const removeColor = useSetAtom(removeFlowerColorAtom);
  const plusQuantity = useSetAtom(plusFlowerColorQuantityAtom);
  const minusQuantity = useSetAtom(minusFlowerColorQuantityAtom);
  const addColor = useSetAtom(addFlowerColorAtom);
  const updateColor = useSetAtom(updateFlowerColorAtom);

  const handleDelete = (id: string) => () => {
    if (flowers.length <= 1) {
      showToast({ message: '한 개 이상의 꽃을 추가해 주세요.' });
      return;
    }
    removeFlower(id);
  };

  const handleAddFlower = () => {
    openModal({ id: 'flower-add-modal', component: <FlowerAddModal /> });
  };

  return (
    <div className='relative mt-4 p-4 border-1 border-gray-100 rounded-5 bg-white'>
      <div className='flex justify-between'>
        <p className='text-title-md'>꽃 구성</p>
        <Button size='sm' className='pl-1' onClick={handleAddFlower}>
          <span className='mx-[3.5px]'><PlusIcon className='w-[13px] h-[13px]' /></span>
          <span className='text-ui-cta-sm'>꽃 추가</span>
        </Button>
      </div>
      <div className='mt-3 flex flex-col'>
        {flowers.map((item, idx) => (
          <div key={item.id}>
            <FlowerCompositionItem
              item={item}
              availableColors={item.availableColors}
              flowerIndex={idx}
              onDelete={handleDelete(item.id)}
              onDeleteColor={(fi, ci) => removeColor({ flowerIndex: fi, colorIndex: ci })}
              onPlusColor={(fi, ci) => plusQuantity({ flowerIndex: fi, colorIndex: ci })}
              onMinusColor={(fi, ci) => minusQuantity({ flowerIndex: fi, colorIndex: ci })}
              onAddColor={(fi, color) => addColor({ flowerIndex: fi, ...color })}
              onUpdateColor={(fi, ci, color) => updateColor({ flowerIndex: fi, colorIndex: ci, color })}
            />
            {idx !== flowers.length - 1 && <div className='my-4 w-full h-[1px] bg-gray-100' />}
          </div>
        ))}
      </div>
    </div>
  );
}
