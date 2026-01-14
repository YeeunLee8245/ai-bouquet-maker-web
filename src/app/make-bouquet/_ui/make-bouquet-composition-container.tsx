import { Button } from '@/shared/ui/button';
import React from 'react';
import PlusIcon from '@/shared/assets/icons/plus.svg';

export default function MakeBouquetCompositionContainer() {
  return (
    <div className='relative mt-4 p-4 border-1 border-gray-100 rounded-5 bg-white'>
      <p className='text-title-md'>꽃 구성</p>
      <Button size='sm' className='pl-1'>
        <span className='mx-[3.5px]'>
          <PlusIcon className='w-[13px] h-[13px]' />
        </span>
        <span className='text-ui-cta-sm'>꽃 추가</span>
      </Button>

    </div>
  );
}
