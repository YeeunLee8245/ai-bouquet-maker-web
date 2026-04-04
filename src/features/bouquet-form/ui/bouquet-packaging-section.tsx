'use client';

import { ColorPicker } from '@/shared/ui/color-picker';
import React, { useRef, useState } from 'react';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import { openModalAtom } from '@/shared/model/modal';
import { useSetAtom } from 'jotai';
import ColorPickModal from './modals/color-pick-modal/color-pick-modal';
import { MAKE_BOUQUET_PACKAGING_DEFAULT_COLORS } from '../model';
import { bouquetPackagingColorAtom, bouquetRibbonColorAtom } from '../model/bouquet-form.atoms';

type TProps = {
  title: string;
};

export default function BouquetPackagingSection({ title }: TProps) {
  const [colors, setColors] = useState<string[]>(MAKE_BOUQUET_PACKAGING_DEFAULT_COLORS);
  const setSelectedColor = useSetAtom(title === '포장지' ? bouquetPackagingColorAtom : bouquetRibbonColorAtom);
  const colorRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const openModal = useSetAtom(openModalAtom);

  const handleOpenColorPickModal = () => {
    openModal({
      id: 'color-pick-modal',
      component: <ColorPickModal onConfirm={(color) => setColors((prev) => [...prev, color])} />,
      position: 'bottom',
    });
  };

  const handleSelectColor = (index: number) => {
    colorRefs.current.forEach((el) => el?.setAttribute('data-state', 'default'));
    colorRefs.current[index]?.setAttribute('data-state', 'selected');
    setSelectedColor(colors[index]);
  };

  return (
    <div>
      <p className='text-title-lg'>{title}</p>
      <div className='flex flex-wrap gap-1 mt-2'>
        {colors.map((color: string, index: number) => (
          <ColorPicker
            key={color}
            color={color}
            ref={(el) => { colorRefs.current[index] = el; }}
            onClick={() => handleSelectColor(index)}
          />
        ))}
        <ColorPicker
          data-state='default'
          variant='additional'
          color='linear-gradient(324deg, #83D400 5.7%, #89CE00 11.24%, #90C800 16.59%, #96C000 21.81%, #9DB800 26.94%, #A4AF00 32.05%, #ACA500 37.19%, #B59900 42.42%, #BD8B00 47.8%, #C77C00 53.38%, #D16A00 59.22%, #DC5500 65.38%, #E73B00 71.91%, #ED2900 83.1%, #F11E00 88.7%, #F40E00 94.3%)'
          onClick={handleOpenColorPickModal}
        >
          <PlusIcon className='m-auto w-[12px] h-[12px] fill-white' />
        </ColorPicker>
      </div>
    </div>
  );
}
