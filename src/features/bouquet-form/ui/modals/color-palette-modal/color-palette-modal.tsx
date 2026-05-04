'use client';

import { useSetAtom } from 'jotai';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { showToastAtom } from '@/shared/model/toast';
import { hslString } from '@/shared/utils/color';
import type { TFlowerColorInfo, TAvailableColor } from '@/features/bouquet-form/model';

// TODO: yeeun 추후 API에서 받아오도록 수정
export const PRESET_COLORS = [
  hslString(0, 70, 60),
  hslString(27, 90, 63),
  hslString(48, 95, 60),
  hslString(140, 50, 50),
  hslString(212, 70, 57),
  hslString(290, 55, 57),
];

type TProps = TModalProps & {
  colorInfos: TFlowerColorInfo[];
  availableColors: TAvailableColor[];
  onConfirm: (color: TAvailableColor) => void;
};

/** 색상 palette 모달 */
export default function ColorPaletteModal({ modalId, colorInfos, availableColors, onConfirm }: TProps) {
  const closeModal = useSetAtom(closeModalAtom);
  const showToast = useSetAtom(showToastAtom);

  const addedHexSet = new Set(colorInfos.map((ci) => ci.hex));

  const handleColorClick = (color: TAvailableColor) => {
    if (addedHexSet.has(color.hex)) {
      showToast({ message: '이미 추가된 색상입니다' });
      return;
    }
    onConfirm(color);
    closeModal(modalId);
  };

  return (
    <div className='flex items-center gap-1 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-[0px_2px_2px_0px_rgba(0,0,0,0.08)]'>
      {availableColors.map((color) => {
        const isAdded = addedHexSet.has(color.hex);
        return (
          <button
            key={color.hex}
            type='button'
            className='color-circle-toggle'
            data-state={isAdded ? 'on' : undefined}
            style={{ backgroundColor: color.hex }}
            onClick={() => handleColorClick(color)}
          />
        );
      })}
    </div>
  );
}
