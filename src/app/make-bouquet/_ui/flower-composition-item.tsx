'use client';

import { ColorPicker } from '@/shared/ui/color-picker';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import Image from 'next/image';
import ColorCompositionItem from './color-composition-item';
import { openModalAtom } from '@/shared/model/modal';
import { useSetAtom } from 'jotai';
import ColorPickModal from './modals/color-pick-modal/color-pick-modal';
import { TFlowerCompositionItem } from '../_types';

type TProps = {
  item: TFlowerCompositionItem;
  flowerIndex: number;
  onDeleteColor: (flowerIndex: number, colorIndex: number) => void;
  onPlusColor: (flowerIndex: number, colorIndex: number) => void;
  onMinusColor: (flowerIndex: number, colorIndex: number) => void;
  onDelete: (flowerIndex: number) => void;
  onAddColor: (flowerIndex: number, color: string) => void;
  onUpdateColor: (flowerIndex: number, colorIndex: number, color: string) => void;
};

export default function FlowerCompositionItem({
  item,
  flowerIndex,
  onDeleteColor,
  onPlusColor,
  onMinusColor,
  onDelete,
  onAddColor,
  onUpdateColor,
}: TProps) {
  const { name, keywords, imageUrl, colorAndQuantities } = item;
  const openModal = useSetAtom(openModalAtom);

  const handleOpenAddColorModal = () => {
    openModal({
      id: `color-pick-modal-add-${flowerIndex}`,
      component: (
        <ColorPickModal
          onConfirm={(color) => onAddColor(flowerIndex, color)}
        />
      ),
      position: 'bottom',
    });
  };

  return (
    <div>
      <div className='flex justify-between'>
        <Image src={imageUrl} alt={name} width={60} height={60} className='w-[60px] h-[60px] rounded-2 object-cover' />
        <ColorPicker
          data-state='default'
          variant='additional'
          color='linear-gradient(324deg, #83D400 5.7%, #89CE00 11.24%, #90C800 16.59%, #96C000 21.81%, #9DB800 26.94%, #A4AF00 32.05%, #ACA500 37.19%, #B59900 42.42%, #BD8B00 47.8%, #C77C00 53.38%, #D16A00 59.22%, #DC5500 65.38%, #E73B00 71.91%, #ED2900 83.1%, #F11E00 88.7%, #F40E00 94.3%)'
          onSelect={handleOpenAddColorModal}>
          <PlusIcon
            className='m-auto w-[12px] h-[12px] fill-white'
          />
        </ColorPicker>
      </div>
      <p className='pt-2 text-body-lg'>{name}</p>
      <div className='pt-2 flex gap-2 flex-wrap'>
        {keywords.map((keyword) => (
          <span key={keyword} className='text-ui-tag bg-gray-100 rounded-3 px-2 py-1 text-gray-400'>
            {keyword}
          </span>
        ))}
      </div>
      <div className='py-4 flex flex-col gap-2'>
        {colorAndQuantities.map(({ color, quantity }, colorIndex) => (
          <ColorCompositionItem
            key={`${color}-${colorIndex}`}
            color={color}
            quantity={quantity}
            flowerIndex={flowerIndex}
            colorIndex={colorIndex}
            onPlus={onPlusColor}
            onMinus={onMinusColor}
            onDelete={onDeleteColor}
            onUpdateColor={onUpdateColor}
          />
        ))}
      </div>
      <button
        type='button'
        onClick={() => onDelete(flowerIndex)}
        className='text-ui-textbtn-md text-gray-400'>꽃 삭제</button>
    </div>
  );
}
