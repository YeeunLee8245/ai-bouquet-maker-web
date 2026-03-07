'use client';

import { Input } from '@/shared/ui/input';
import { MY_BOUQUET_INFO_DATAS } from '../_datas';

export default function MyBouquetInfo() {
  return (
    <div className='info-border px-micro'>
      <p className='text-title-md'>꽃다발 이름</p>
      <div className='flex flex-col gap-4 mt-3 px-micro'>
        {MY_BOUQUET_INFO_DATAS.map(({ id, name }) => (
          <div key={id}>
            <p className='text-body-lg'>{name}</p>
            <Input
              value={''}
              disabled
              wrapperClassName='mt-2 w-full h-[42px] px-3 py-2 bg-gray-50 rounded-4'
              className='px-micro pb-micro text-body-md'
            />
          </div>
        ))}
      </div>
    </div>
  );
}
