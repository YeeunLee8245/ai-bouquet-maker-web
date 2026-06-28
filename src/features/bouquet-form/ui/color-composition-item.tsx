'use client';

import { useRef } from 'react';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import XIcon from '@/shared/assets/icons/x.svg';
import { ColorSwitchToggle } from '@/shared/ui/button';
import { openModalAtom } from '@/shared/model/modal';
import { useSetAtom } from 'jotai';
import ColorPaletteModal from './modals/color-palette-modal/color-palette-modal';
import type { TFlowerColorInfo, TAvailableColor } from '../model';

type TProps = {
  color: string;
  quantity: number;
  tags: string[];
  colorInfos: TFlowerColorInfo[];
  availableColors: TAvailableColor[];
  flowerIndex: number;
  colorIndex: number;
  onPlus: (flowerIndex: number, colorIndex: number) => void;
  onMinus: (flowerIndex: number, colorIndex: number) => void;
  onDelete: (flowerIndex: number, colorIndex: number) => void;
  onUpdateColor: (flowerIndex: number, colorIndex: number, color: string) => void;
};

export default function ColorCompositionItem({
  color, quantity, tags, colorInfos, availableColors, flowerIndex, colorIndex, onPlus, onMinus, onDelete, onUpdateColor,
}: TProps) {
  const openModal = useSetAtom(openModalAtom);
  const colorToggleRef = useRef<HTMLDivElement>(null);

  const handleOpenColorPickModal = () => {
    openModal({
      id: `color-pick-modal-update-${flowerIndex}-${colorIndex}`,
      component: (
        <ColorPaletteModal
          colorInfos={colorInfos}
          availableColors={availableColors}
          onConfirm={(selectedColor) => onUpdateColor(flowerIndex, colorIndex, selectedColor.hex)}
        />
      ),
      position: 'anchor',
      anchor: { el: colorToggleRef.current, position: 'bottom-right', gap: 4 },
      canCloseOnBackgroundClick: true,
    });
  };

  return (
    <div className='flex items-center justify-between'>
      <div className='flex gap-2 items-center'>
        <button type='button' onClick={() => onDelete(flowerIndex, colorIndex)} className='m-1'>
          <XIcon className='w-[16px] h-[16px] fill-gray-200' />
        </button>
        <div ref={colorToggleRef}>
          <ColorSwitchToggle colorHex={color} onClick={handleOpenColorPickModal} />
        </div>
        <div className='flex gap-1 flex-wrap'>
          {tags.map((tag) => (
            <span key={tag} className='text-ui-tag bg-gray-100 rounded-3 px-2 py-1 text-gray-400'>{tag}</span>
          ))}
        </div>
      </div>
      <div className='w-fit flex items-center rounded-3 bg-gray-50'>
        <button
          type='button'
          onClick={() => onMinus(flowerIndex, colorIndex)}
          className='m-1 pl-[4px] pr-[2px] w-[20px] h-[20px] rounded hover:bg-gray-100 transition-colors cursor-pointer group'
        >
          <span className='block w-[14px] h-[2px] bg-gray-200 group-hover:bg-gray-400 transition-colors' />
        </button>
        <p className='text-body-md'>{quantity}</p>
        <button
          type='button'
          onClick={() => onPlus(flowerIndex, colorIndex)}
          className='m-1 rounded hover:bg-gray-100 transition-colors cursor-pointer group'
        >
          <PlusIcon className='pl-[2px] pr-[4px] w-[20px] h-[20px] fill-gray-200 group-hover:fill-gray-400 transition-colors' />
        </button>
      </div>
    </div>
  );
}
