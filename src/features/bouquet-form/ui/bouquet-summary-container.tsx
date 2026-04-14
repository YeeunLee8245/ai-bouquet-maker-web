'use client';

import { useAtomValue } from 'jotai';
import { bouquetFlowersAtom } from '../model';

export default function BouquetSummaryContainer() {
  const flowers = useAtomValue(bouquetFlowersAtom);
  const totalQuantity = flowers.reduce(
    (sum, f) => sum + f.colorInfos.reduce((s, ci) => s + ci.quantity, 0),
    0,
  );

  return (
    <div className='mt-4 p-4 border-1 border-gray-100 rounded-5 bg-white'>
      <p className='text-title-md px-micro'>꽃다발 요약</p>
      <div className='grid grid-cols-[auto_1fr] gap-y-1 mt-3 px-micro'>
        <span className='text-body-lg text-gray-400'>총 송이 수</span>
        <span className='text-body-lg text-end'>{totalQuantity}송이</span>
        <span className='text-body-lg text-gray-400'>꽃 종류</span>
        <span className='text-body-lg text-end'>{flowers.length}종</span>
      </div>
    </div>
  );
}
