'use client';

import { ColorPicker } from '@/shared/ui/color-picker';
import { useEffect, useRef, useState } from 'react';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import { openModalAtom } from '@/shared/model/modal';
import { atom, useAtom, useSetAtom } from 'jotai';
import ColorHSLPickModal from './modals/color-pick-modal/color-pick-modal';
import { MAKE_BOUQUET_PACKAGING_DEFAULT_COLORS } from '../model';

type TProps = {
  title: string;
  colorAtom: ReturnType<typeof atom<string>>;
};

export default function BouquetPackagingSection({ title, colorAtom }: TProps) {
  const [currentColor, setSelectedColor] = useAtom(colorAtom);
  const [colors, setColors] = useState<string[]>(() =>
    currentColor && !MAKE_BOUQUET_PACKAGING_DEFAULT_COLORS.includes(currentColor)
      ? [...MAKE_BOUQUET_PACKAGING_DEFAULT_COLORS, currentColor]
      : MAKE_BOUQUET_PACKAGING_DEFAULT_COLORS,
  );
  const colorRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const openModal = useSetAtom(openModalAtom);

  // 저장된 색상을 초기 선택 상태로 반영
  useEffect(() => {
    const index = colors.indexOf(currentColor);
    if (index === -1) { return; }
    colorRefs.current.forEach((el) => el?.setAttribute('data-state', 'default'));
    colorRefs.current[index]?.setAttribute('data-state', 'selected');
  }, [currentColor, colors]);

  const handleOpenColorPickModal = () => {
    openModal({
      id: 'color-pick-modal',
      component: <ColorHSLPickModal onConfirm={(color) => setColors((prev) => [...prev, color])} />,
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
