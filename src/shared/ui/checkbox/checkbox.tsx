import React from 'react';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Checkbox({ checked, onChange, ...props }: Props) {
  return (
    <input
      type='checkbox'
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className='
      w-5 h-5 rounded-2 border-1 border-gray-100 bg-gray-50
      checked:bg-primary-400
      checked:border-primary-400
      checked:text-white
      checked:fill-white
      '
      {...props}
    />
  );
}
