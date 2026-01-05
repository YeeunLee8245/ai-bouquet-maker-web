import Image from 'next/image';
import React from 'react';
import UpArrowIcon from '@/shared/assets/icons/up_arrow.svg';

type TProps = {
  imageUrl: string;
  name: string;
};

function FlowerImagesContainer({ imageUrl, name }: TProps) {
  return (
    <div>
      <Image
        src={imageUrl}
        alt={name}
        width={360}
        height={360}
        className='object-cover aspect-square'
      />
      <button>
        <UpArrowIcon className='w-[17.5px] h-[18.3px]'/>
      </button>
    </div>
  );
}

export default FlowerImagesContainer;
