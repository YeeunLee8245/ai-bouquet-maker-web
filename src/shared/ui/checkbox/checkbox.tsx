import React from 'react';
import CheckIcon from '@/shared/assets/icons/check.svg';

type Props = {
  checked?: boolean;
  onChange: (checked: boolean) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

export default function Checkbox({ checked, onChange, ...props }: Props) {
  return (
    <label className='relative block size-5' aria-label='checkbox'>
      <input
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className='
          cursor-pointer
          peer
          appearance-none
          size-full rounded-2 border-1 border-gray-100 bg-gray-50
          checked:bg-primary-400
          checked:border-primary-400
        '
        {...props}
      />
      <div className='cursor-pointer absolute top-0 left-0 w-full h-full items-center justify-center hidden peer-checked:flex'>
        <CheckIcon className='size-[12px] fill-white' />
      </div>
    </label>
  );
}
