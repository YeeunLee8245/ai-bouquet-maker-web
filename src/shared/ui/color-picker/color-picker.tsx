'use client';

import { cn } from '@/shared/utils/styles';
import { useRef } from 'react';
import { IColorPickerProps } from './types';

/**
 * @description 상태 데이터 속성 이름
 * @example data-state="default"
 * @example data-state="selected"
 */
const DATA_ATTR_STATE = 'data-state';

const variantStyles: Record<NonNullable<IColorPickerProps['variant']>, string> = {
  primary: 'hover:shadow-[0_0_0_2px_#CECECE] data-[state="selected"]:shadow-[0_0_0_2px_#CECECE]',
  additional: 'hover:after:content-[""] hover:after:absolute hover:after:inset-0 hover:after:bg-black/20 hover:after:rounded-2 data-[state="selected"]:after:content-[""] data-[state="selected"]:after:absolute data-[state="selected"]:after:inset-0 data-[state="selected"]:after:bg-black/20 data-[state="selected"]:after:rounded-2',
};

function ColorPicker({ className, children, color, variant = 'primary', onSelect, ...props }: IColorPickerProps) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      {...{ [DATA_ATTR_STATE]: 'default' }}
      onClick={() => { onSelect(color); }}
      type='button'
      style={{ background: color}}
      className={cn(
        'relative w-11 h-11 rounded-2 border-2 border-gray-100',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export default ColorPicker;
