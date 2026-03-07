'use client';

import { cn } from '@/shared/utils/styles';
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

function ColorPicker(
  {
    className,
    children,
    color,
    variant = 'primary',
    ref,
    ...props
  }: IColorPickerProps,
) {
  return (
    <button
      ref={ref}
      {...{ [DATA_ATTR_STATE]: 'default' }}
      type='button'
      style={{ background: color}}
      className={cn(
        'relative w-11 h-11 rounded-2 border-2 border-gray-100',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default ColorPicker;
