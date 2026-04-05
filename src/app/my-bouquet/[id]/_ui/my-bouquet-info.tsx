'use client';

import { Input } from '@/shared/ui/input';
import { MY_BOUQUET_INFO_DATAS } from '../_datas';

interface IMyBouquetInfoProps {
  occasion: string | null;
  recipient: string | null;
  message: string | null;
}

export default function MyBouquetInfo({ occasion, recipient, message }: IMyBouquetInfoProps) {
  const valueMap: Record<string, string | null> = {
    occasion,
    recipient,
    message,
  };

  return (
    <div className='info-border px-micro'>
      <p className='text-title-md'>꽃다발 정보</p>
      <div className='flex flex-col gap-4 mt-3 px-micro'>
        {MY_BOUQUET_INFO_DATAS.map(({ id, name }) => (
          <div key={id}>
            <p className='text-body-lg'>{name}</p>
            <Input
              value={valueMap[id] ?? ''}
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
