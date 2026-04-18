'use client';

import { useRef } from 'react';
import { ColorPicker } from '@/shared/ui/color-picker';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import Image from 'next/image';
import ColorCompositionItem from './color-composition-item';
import { openModalAtom } from '@/shared/model/modal';
import { useSetAtom } from 'jotai';
import ColorPaletteModal from './modals/color-add-modal/color-palette-modal';
import type { TFlowerCompositionItem, TAvailableColor } from '../model';

type TProps = {
  item: TFlowerCompositionItem;
  availableColors: TAvailableColor[];
  flowerIndex: number;
  onDeleteColor: (flowerIndex: number, colorIndex: number) => void;
  onPlusColor: (flowerIndex: number, colorIndex: number) => void;
  onMinusColor: (flowerIndex: number, colorIndex: number) => void;
  onDelete: (flowerIndex: number) => void;
  onAddColor: (flowerIndex: number, color: TAvailableColor) => void;
  onUpdateColor: (flowerIndex: number, colorIndex: number, color: string) => void;
};

export default function FlowerCompositionItem({
  item, availableColors, flowerIndex, onDeleteColor, onPlusColor, onMinusColor, onDelete, onAddColor, onUpdateColor,
}: TProps) {
  const { name, keywords, imageUrl, colorInfos } = item;
  const openModal = useSetAtom(openModalAtom);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const handleOpenAddColorModal = () => {
    openModal({
      id: `color-pick-modal-add-${flowerIndex}`,
      component: (
        <ColorPaletteModal
          colorInfos={colorInfos}
          availableColors={availableColors}
          onConfirm={(color) => onAddColor(flowerIndex, color)}
        />
      ),
      position: 'anchor',
      anchorEl: colorPickerRef.current,
      anchorSide: 'bottom',
      canCloseOnBackgroundClick: true,
    });
  };

  return (
    <div>
      <div className='flex justify-between'>
        {imageUrl ? (
          <Image src={imageUrl} alt={name} width={60} height={60} className='w-[60px] h-[60px] rounded-2 object-cover' />
        ) : (
          <div className='w-[60px] h-[60px] rounded-2 bg-gray-100 animate-pulse' />
        )}
        <div ref={colorPickerRef}>
          <ColorPicker
            data-state='default'
            variant='additional'
            color='linear-gradient(324deg, #83D400 5.7%, #89CE00 11.24%, #90C800 16.59%, #96C000 21.81%, #9DB800 26.94%, #A4AF00 32.05%, #ACA500 37.19%, #B59900 42.42%, #BD8B00 47.8%, #C77C00 53.38%, #D16A00 59.22%, #DC5500 65.38%, #E73B00 71.91%, #ED2900 83.1%, #F11E00 88.7%, #F40E00 94.3%)'
            onClick={handleOpenAddColorModal}
          >
            <PlusIcon className='m-auto w-[12px] h-[12px] fill-white' />
          </ColorPicker>
        </div>
      </div>
      <p className='pt-2 text-body-lg'>{name}</p>
      <div className='py-4 flex flex-col gap-2'>
        {colorInfos.map(({ hex, quantity, tags }, colorIndex) => (
          <ColorCompositionItem
            key={`${hex}-${colorIndex}`}
            color={hex}
            quantity={quantity}
            tags={tags}
            flowerIndex={flowerIndex}
            colorIndex={colorIndex}
            onPlus={onPlusColor}
            onMinus={onMinusColor}
            onDelete={onDeleteColor}
            onUpdateColor={onUpdateColor}
          />
        ))}
      </div>
      <button type='button' onClick={() => onDelete(flowerIndex)} className='text-ui-textbtn-md text-gray-400'>
        꽃 삭제
      </button>
    </div>
  );
}
