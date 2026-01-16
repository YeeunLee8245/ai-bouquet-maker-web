'use client';

import { cn } from '@/shared/utils/styles';
import { useRef } from 'react';
import { IColorPickerProps } from './types';

/**
 * @description 상태 데이터 속성 이름
 * @example data-state="default"
 * @example data-state="selected"
 * @example data-state="add"
 */
const DATA_ATTR_STATE = 'data-state';

function ColorPicker({ className, ...props }: IColorPickerProps) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      {...{ [DATA_ATTR_STATE]: 'default' }}
      type='button'
      className={cn(
        'relative w-11 h-11 rounded-2 border-2 border-gray-100',
        // hover 시 기존 border-2 외부에 2px shadow border 추가
        'hover:shadow-[0_0_0_2px_#CECECE]',
        'data-[state="selected"]:shadow-[0_0_0_2px_#CECECE]',
        'data-[state="add"]:bg-gray-200',
        className,
      )}
    >
      ColorPicker
    </button>
  );
}

export default ColorPicker;
