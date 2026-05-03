'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import UpArrowIcon from '@/shared/assets/icons/up_arrow.svg';
import { useRouter } from 'next/navigation';
import { Carousel, CarouselIndicator } from '@/shared/ui/carousel';

type TProps = {
  images: {
    url: string;
    name: string;
  }[];
  prevPath?: string;
};

function FlowerImagesContainer({ images, prevPath }: TProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className='tablet:flex-shrink-0'>
      <div className='relative'>
        <Carousel
          index={currentIndex}
          length={images.length}
          onIndexChange={setCurrentIndex}
        >
          {images.map(({ url, name }, idx) => (
            <Image
              key={idx}
              src={url}
              alt={name}
              width={512}
              height={512}
              className='object-cover aspect-square w-full tablet:w-[440px] tablet:h-[440px] pc:w-[512px] pc:h-[512px]'
            />
          ))}
        </Carousel>
        <CarouselIndicator
          className='absolute bottom-[12px] left-[50%] transform -translate-x-1/2 pc:hidden'
          count={images.length}
          activeIndex={currentIndex}
        />
        <button
          onClick={() => prevPath ? router.push(prevPath) : router.back()}
          aria-label='뒤로가기'
          className='w-[24px] h-[24px] absolute top-[16px] left-[16px] transform rotate-[-90deg] ml-[0.6px] justify-items-center'
        >
          <UpArrowIcon className='w-[17.5px] h-[18.3px] text-white'/>
        </button>
      </div>
      {/* PC 썸네일 리스트 */}
      <div className='hidden pc:flex gap-2 mt-2'>
        {images.slice(0, 6).map(({ url, name }, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-[76px] h-[76px] flex-shrink-0 overflow-hidden rounded-2 border-2 transition-colors ${currentIndex === idx ? 'border-primary-400' : 'border-transparent'}`}
          >
            <Image src={url} alt={name} width={76} height={76} className='object-cover w-full h-full' />
          </button>
        ))}
      </div>
    </div>
  );
}

export default FlowerImagesContainer;
