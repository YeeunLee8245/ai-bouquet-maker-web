import React, { useEffect, useState } from 'react';
import { IDirectoryEventHub } from '../_types';
import { SearchInput } from '@/shared/ui/input';
import { useDebounceValue } from '@/shared/hooks/useDebounceValue';

interface IProps {
  eventHub: IDirectoryEventHub;
}

function DirectorySearchInput({ eventHub }: IProps) {
  const [value, setValue] = useState<string>('');
  const debouncedValue = useDebounceValue(value, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    console.log(debouncedValue);
  }, [debouncedValue]);

  return (
    <SearchInput placeholder='꽃 이름, 꽃말, 설명 등으로 검색' className='mt-4' value={value} onChange={handleChange}/>
  );
}

export default DirectorySearchInput;
