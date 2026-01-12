import React from 'react';
import { IInputProps } from './types';

function Input({ wrapperClassName, leftIcon, className, ...props }: IInputProps) {
  const { component: LeftIcon, className: leftIconClassName } = leftIcon ?? {};

  return (
    <div className={`relative flex items-center ${wrapperClassName}`}>
      {leftIcon && <div className={leftIconClassName}>{LeftIcon}</div>}
      <input {...props} className={className} />
    </div>
  );
}

export default Input;
