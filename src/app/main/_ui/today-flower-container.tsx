import { KeywordChip } from '@/shared/ui/chip';
import Image from 'next/image';
import React from 'react';
import { TTodaysFlower } from '../_types';

type TProps = {
  flower?: TTodaysFlower;
};

export default function TodayFlowerContainer({ flower }: TProps) {
  const name = flower?.name_ko ?? '거베라';
  const imageUrl = flower?.image_url ?? '/temp_geobera.png';
  const meanings = flower?.representative_meanings ?? ['사랑', '고백'];

  return (
    <div className='relative'>
      {/* 배경 이미지 */}
      <Image
        src='/images/bg_main_bottom.webp'
        alt='main'
        width={360}
        height={324}
        className='absolute z-[-1] bottom-0 left-0 w-full h-[324px] object-cover object-bottom'
      />
      <div className='relative flex flex-col gap-3 items-center border-t-2 border-gray-100 pt-5 pb-9'>
        <p className='text-title-md text-gray-700'>오늘의 추천 꽃</p>

        {/* cover 이미지 + 하단 그라데이션 오버레이 + 텍스트 */}
        <button className='relative w-[140px] h-[196px]'>
          <div className='absolute inset-0 rounded-[24px] overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.12)]'>
            <Image
              src={imageUrl}
              alt={name}
              fill
              className='object-cover'
            />
          </div>

          <div className='absolute inset-0 rounded-[24px] bg-[linear-gradient(180deg,#71928f00_50%,#71928F_100%)]' />

          <div className='absolute inset-0 rounded-[24px] border-2 border-white/40 pointer-events-none' />

          <p className='absolute left-0 right-0 bottom-4 text-center text-[18px] font-semibold leading-[24px] tracking-[-0.072px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]'>
            {name}
          </p>
        </button>

        <span className='mt-3 flex gap-1 items-center'>
          {meanings.map((tag) => (
            <KeywordChip key={tag} tag={tag} className='bg-gray-50' />
          ))}
        </span>
      </div>
    </div>
  );
}
