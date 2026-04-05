'use client';

import { useSetAtom } from 'jotai';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { showToastAtom } from '@/shared/model/toast';
import { hslString } from '@/shared/utils/color';
import type { TFlowerColorAndQuantity } from '@/features/bouquet-form/model';

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
  colorAndQuantities: TFlowerColorAndQuantity[];
  onConfirm: (color: string) => void;
};

export default function ColorAddModal({ modalId, colorAndQuantities, onConfirm }: TProps) {
  const closeModal = useSetAtom(closeModalAtom);
  const showToast = useSetAtom(showToastAtom);

  const handleColorClick = (color: string) => {
    const isDuplicate = colorAndQuantities.some((cq) => cq.color === color);
    if (isDuplicate) {
      showToast({ message: '이미 추가된 색상입니다' });
      return;
    }
    onConfirm(color);
    closeModal(modalId);
  };

  return (
    <div className='flex items-center gap-1 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-[0px_2px_2px_0px_rgba(0,0,0,0.08)]'>
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          type='button'
          aria-label={color}
          onClick={() => handleColorClick(color)}
          className='w-8 h-8 rounded-full border-2 border-transparent hover:border-gray-300 transition-colors shrink-0'
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
