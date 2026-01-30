import Image from 'next/image';
import React from 'react';

export default function TodayFlowerContainer() {
  return (
    <div className='flex flex-col gap-3 items-center border-t-2 border-gray-100 pt-5 pb-9'>
      <p className='text-title-md text-gray-700'>오늘의 추천 꽃</p>

      {/* cover 이미지 + 하단 그라데이션 오버레이 + 텍스트 */}
      {/* TODO: yeeun 테두리 색상 문의 -> 흰색/40?? 그런데 피그마에선 왜 약간 회색으로 보이지,, */}
      <div className='relative w-[140px] h-[196px] rounded-[24px] overflow-hidden border-2 border-gray-400/40 shadow-[0_6px_20px_rgba(0,0,0,0.12)]'>
        <Image
          src='/temp_geobera.png'
          alt='today-flower'
          fill
          sizes='140px'
          className='object-cover'
        />

        <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(113,146,143,0)_50%,#71928F_100%)]' />

        <p className='absolute left-0 right-0 bottom-4 text-center text-[18px] font-semibold leading-[24px] tracking-[-0.072px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]'>
          거베라
        </p>
      </div>

      <p className='text-body-xsm text-gray-700 text-center'>
        거베라
      </p>
    </div>
  );
}
