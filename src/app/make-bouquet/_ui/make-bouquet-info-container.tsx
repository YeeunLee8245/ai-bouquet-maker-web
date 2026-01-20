import React from 'react';
import { MAKE_BOUQUET_INFO_DATAS } from '../_datas';
import { Input } from '@/shared/ui/input';

export default function MakeBouquetInfoContainer() {
  return (
    <div className='p-4 border-1 border-gray-100 rounded-5 bg-white'>
      <p className='text-title-md px-micro'>꽃다발 정보</p>
      <div className='flex flex-col gap-4 mt-3 px-micro'>
        {MAKE_BOUQUET_INFO_DATAS.map(({ title, placeholder, isRequired }) => (
          <div key={title}>
            <div>
              <span className='text-body-lg'>{title}</span>
              {isRequired && <span className='text-body-lg text-[#E86653]'>*</span>}
            </div>
            {/* TODO: yeeun button form 형식으로 error 처리 및 submit */}
            <Input placeholder={placeholder} className='mt-2 w-full py-2 px-3 rounded-4 border-1 border-gray-100'/>
            {/* TODO: yeeun form 붙이면서 분기 로직 수정 */}
            {isRequired && <p className='mx-micro mt-2 text-body-xsm text-[#E86652]'>{'필수 입력 항목이에요.'}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
