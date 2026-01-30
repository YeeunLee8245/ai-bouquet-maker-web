'use client';

import React from 'react';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import XIcon from '@/shared/assets/icons/x.svg';
import { ColorSwitchToggle } from '@/shared/ui/button';
import { openModalAtom } from '@/shared/model/modal';
import { useSetAtom } from 'jotai';
import ColorPickModal from './modals/color-pick-modal/color-pick-modal';

type TProps = {
  color: string;
  quantity: number;
  onPlus: (color: string) => void;
  onMinus: (color: string) => void;
  onDelete: (color: string) => void;
};

export default function ColorCompositionItem({ color, quantity, onPlus, onMinus, onDelete }: TProps) {
  const openMddal = useSetAtom(openModalAtom);

  const handleOpenColorPickModal = () => {
    openMddal({
      id: 'color-pick-modal',
      component: <ColorPickModal />,
      position: 'bottom',
    });
  };
  return (
    <div className='flex items-center justify-between'>
      <div className='flex gap-2'>
        {/* 아이템 삭제 버튼 */}
        <button
          type='button'
          onClick={() => onDelete(color)}
          className='m-1'>
          <XIcon className='w-[16px] h-[16px] fill-gray-200'/>
        </button>
        <ColorSwitchToggle
          colorHex={color}
          onClick={handleOpenColorPickModal}
        />
      </div>
      <div className='w-fit flex items-center rounded-3 bg-gray-50'>
        {/* 아이템 개수 감소 버튼 */}
        <button
          type='button'
          onClick={() => onMinus(color)}
          className='m-1 pl-[4px] pr-[2px] w-[20px] h-[20px] rounded hover:bg-gray-100 transition-colors cursor-pointer group'>
          <span className='block w-[14px] h-[2px] bg-gray-200 group-hover:bg-gray-400 transition-colors'/>
        </button>
        <p className='text-body-md'>{quantity}</p>
        {/* 아이템 개수 증가 버튼 */}
        <button
          type='button'
          onClick={() => onPlus(color)}
          className='m-1 rounded hover:bg-gray-100 transition-colors cursor-pointer group'>
          <PlusIcon className='pl-[2px] pr-[4px] w-[20px] h-[20px] fill-gray-200 group-hover:fill-gray-400 transition-colors' />
        </button>
      </div>
    </div>
  );
}
