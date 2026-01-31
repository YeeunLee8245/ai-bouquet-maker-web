import { KeywordChip } from '@/shared/ui/chip';
import Image from 'next/image';
import React from 'react';

export default function TodayFlowerContainer() {
  return (
    <div className='flex flex-col gap-3 items-center border-t-2 border-gray-100 pt-5 pb-9'>
      <p className='text-title-md text-gray-700'>오늘의 추천 꽃</p>

      {/* cover 이미지 + 하단 그라데이션 오버레이 + 텍스트 */}
      <button className='relative w-[140px] h-[196px]'>
        <div className='absolute inset-0 rounded-[24px] overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.12)]'>
          <Image
            src='/temp_geobera.png'
            alt='today-flower'
            fill
            className='object-cover'
          />
        </div>

        <div className='absolute inset-0 rounded-[24px] bg-[linear-gradient(180deg,#71928f00_50%,#71928F_100%)]' />

        <div className='absolute inset-0 rounded-[24px] border-2 border-white/40 pointer-events-none' />

        <p className='absolute left-0 right-0 bottom-4 text-center text-[18px] font-semibold leading-[24px] tracking-[-0.072px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]'>
          거베라
        </p>
      </button>

      <span className='mt-3 flex gap-1 items-center'>
        <KeywordChip tag='사랑' className='bg-gray-50' />
        <KeywordChip tag='고백' className='bg-gray-50' />
      </span>
    </div>
  );
}
