'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { getColorNameFromHsl, hslString } from '@/shared/utils/color';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { useSetAtom } from 'jotai';

function ColorPickModal({ modalId }: TModalProps) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const closeModal = useSetAtom(closeModalAtom);

  const selectedColor = hslString(hue, saturation, lightness);

  return (
    <div className='relative flex flex-col w-[360px] min-h-[584px] bg-gray-50 rounded-t-5'>
      <div className='w-full flex-1 px-4 pt-4 rounded-t-5'>
        <div className='flex justify-between px-micro'>
          <p className='text-title-md'>색상 선택</p>
          <button
            type='button'
            className='text-ui-textbtn-md text-gray-400 hover:text-gray-500'
            onClick={() => closeModal(modalId)}
          >
            닫기
          </button>
        </div>

        <div className='py-4'>
          {/* 색상 미리보기 */}
          <div
            className='w-full h-[120px] rounded-5 border-1 border-gray-100'
            style={{ backgroundColor: selectedColor }}
          />
          <p className='pt-2 text-center text-body-xsm text-gray-400'>
            {getColorNameFromHsl(hue, saturation, lightness)}
          </p>
        </div>

        <div className='flex flex-col gap-6'>
          {/* 색상 (Hue) */}
          <div className='flex flex-col gap-2'>
            <label className='text-title-md'>색상</label>
            <input
              type='range'
              min='0'
              max='360'
              // value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              className='input-range w-full h-3 rounded-6'
              style={{
                background: 'linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%))',
              }}
            />
          </div>
          {/* 채도 (Saturation) */}
          <div className='flex flex-col gap-2'>
            <label className='text-title-md'>채도</label>
            <input
              type='range'
              min='0'
              max='100'
              // value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className='input-range w-full h-3 rounded-6'
              style={{
                background: `linear-gradient(to right, hsl(${hue}, 0%, 50%), hsl(${hue}, 100%, 50%))`,
              }}
            />
          </div>

          {/* 밝기 (Lightness) */}
          <div className='flex flex-col gap-2'>
            <label className='text-title-md'>밝기</label>
            <input
              type='range'
              min='0'
              max='100'
              // value={lightness}
              onChange={(e) => setLightness(Number(e.target.value))}
              className='input-range w-full h-3 rounded-6'
              style={{
                background: `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`,
              }}
            />
          </div>
        </div>

      </div>

      <Button size='lg' className='w-auto mx-4 mb-8'>
        선택 완료
      </Button>
    </div>
  );
}

export default ColorPickModal;
