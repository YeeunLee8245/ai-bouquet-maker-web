'use client';

import { ColorPicker } from '@/shared/ui/color-picker';
import React, { useState } from 'react';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import { openModalAtom } from '@/shared/model/modal';
import { useSetAtom } from 'jotai';
import ColorPickModal from './modals/color-pick-modal/color-pick-modal';

type TProps = {
  title: string;
  defaultColors: string[];
};

export default function BouquetPackagingSection({ title, defaultColors }: TProps) {
  // TODO: yeeun 선택된 색상 관리 atom으로 변경(API 데이터 연결 후)
  const [selectedColors, setSelectedColors] = useState<string[]>(defaultColors);
  const openMddal = useSetAtom(openModalAtom);

  const handleOpenColorPickModal = () => {
    openMddal({
      id: 'color-pick-modal',
      component: <ColorPickModal />,
      position: 'bottom',
    });
  };

  return (
    <div>
      <p className='text-title-lg'>{title}</p>
      <div className='flex flex-wrap gap-1'>
        {selectedColors.map((color) => (
          <ColorPicker key={color} color={color} onSelect={() => {}} />
        ))}
        {/* 색상 추가 버튼 */}
        <ColorPicker
          data-state='default'
          variant='additional'
          color='linear-gradient(324deg, #83D400 5.7%, #89CE00 11.24%, #90C800 16.59%, #96C000 21.81%, #9DB800 26.94%, #A4AF00 32.05%, #ACA500 37.19%, #B59900 42.42%, #BD8B00 47.8%, #C77C00 53.38%, #D16A00 59.22%, #DC5500 65.38%, #E73B00 71.91%, #ED2900 83.1%, #F11E00 88.7%, #F40E00 94.3%)'
          onClick={handleOpenColorPickModal}
          onSelect={() => {}}>
          <PlusIcon
            className='m-auto w-[12px] h-[12px] fill-white'
          />
        </ColorPicker>
      </div>
    </div>
  );
}
