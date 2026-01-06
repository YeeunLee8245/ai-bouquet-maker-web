'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import UpArrowIcon from '@/shared/assets/icons/up_arrow.svg';
import { useRouter } from 'next/navigation';
import { Carousel, CarouselIndicator } from '@/shared/ui/carousel';

type TProps = {
  imageUrl: string;
  name: string;
};

const images = [
  {
    id: 1,
    url: '/temp_tulip.png',
    name: 'Image 1',
  },
  {
    id: 2,
    url: '/temp_geobera.png',
    name: 'Image 2',
  },
];

function FlowerImagesContainer({ imageUrl, name }: TProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className='relative'>
      <Carousel
        index={currentIndex}
        length={images.length}
        onIndexChange={setCurrentIndex}
      >
        {images.map((image) => (
          <Image key={image.id} src={image.url} alt={image.name} width={360} height={360} className='object-cover aspect-square' />
        ))}
      </Carousel>
      <CarouselIndicator
        count={images.length}
        activeIndex={currentIndex}
      />
      <button
        onClick={() => router.back()}
        aria-label='뒤로가기'
        className='w-[24px] h-[24px] absolute top-[16px] left-[16px] transform rotate-[-90deg] ml-[0.6px] justify-items-center'
      >
        <UpArrowIcon className='w-[17.5px] h-[18.3px]'/>
      </button>
    </div>
  );
}

export default FlowerImagesContainer;
