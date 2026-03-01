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
    <div className='relative'>
      <Carousel
        index={currentIndex}
        length={images.length}
        onIndexChange={setCurrentIndex}
      >
        {images.map(({ url, name }, idx) => (
          <Image key={idx} src={url} alt={name} width={360} height={360} className='object-cover aspect-square' />
        ))}
      </Carousel>
      <CarouselIndicator
        className='absolute bottom-[12px] left-[50%] transform -translate-x-1/2'
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
  );
}

export default FlowerImagesContainer;
