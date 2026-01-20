'use client';

import React from 'react';
import { TFlowerCompositionItem } from '../_types';
import Image from 'next/image';
import { ColorPicker } from '@/shared/ui/color-picker';
import PlusIcon from '@/shared/assets/icons/plus.svg';

type TProps = {
  item: TFlowerCompositionItem;
};

export default function FlowerCompositionItem({ item }: TProps) {
  const { id, name, keywords, imageUrl } = item;

  return (
    <div>
      <div className='flex justify-between'>
        <Image src={imageUrl} alt={name} width={60} height={60} className='w-[60px] h-[60px] rounded-2 object-cover' />
        <ColorPicker
          data-state='selected'
          variant='additional'
          color='linear-gradient(324deg, #83D400 5.7%, #89CE00 11.24%, #90C800 16.59%, #96C000 21.81%, #9DB800 26.94%, #A4AF00 32.05%, #ACA500 37.19%, #B59900 42.42%, #BD8B00 47.8%, #C77C00 53.38%, #D16A00 59.22%, #DC5500 65.38%, #E73B00 71.91%, #ED2900 83.1%, #F11E00 88.7%, #F40E00 94.3%);'
          onSelect={() => {}}>
          <PlusIcon
            className='m-auto w-[12px] h-[12px] fill-white'
          />
        </ColorPicker>
      </div>
      <div>
        <p>{name}</p>
      </div>
    </div>
  );
}
