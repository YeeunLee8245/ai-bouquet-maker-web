import React from 'react';
import SearchIcon from '@/shared/assets/icons/search.svg';
import Input from './input';
import { IInputProps } from './types';

function SearchInput({ className, ...props }: IInputProps) {
  return (
    <Input
      wrapperClassName={`w-full h-[40px] rounded-5 bg-gray-100 pr-4 ${className}`}
      leftIcon={{ component: <SearchIcon />, className: 'px-[10.4px]' }}
      className="w-full pb-micro text-ui-placeholder placeholder:text-gray-400" {...props}/>
  );
}

export default SearchInput;
