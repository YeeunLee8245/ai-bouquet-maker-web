import React from 'react';
import { Button } from '@/shared/ui/button';

function ColorPickModalPage() {
  return (
    <div className='relative flex flex-col min-h-[584px]'>
      <div className='w-full flex-1 px-4 pt-4 rounded-t-5'>
        <div className='flex justify-between px-micro'>
          <p className='text-title-md'>색상 선택</p>
          <button type='button' className='text-ui-textbtn-md text-gray-400 hover:text-gray-500'>
            닫기
          </button>
        </div>
        <div className='py-4'>
          <div className='w-full h-[120px] rounded-5 border-1 border-gray-100'/>
          <p className='pt-2 text-center text-body-xsm text-gray-400'>색상</p>
        </div>
      </div>
      <Button size='lg' className='w-auto mx-4 mb-8'>
        선택 완료
      </Button>
    </div>
  );
}

export default ColorPickModalPage;
