'use client';

import { ColorPicker } from '@/shared/ui/color-picker';
import React from 'react';

type TProps = {
  title: string;

};

export default function BouquetPackagingSection({ title }: TProps) {
  return (
    <div>
      <p className='text-title-lg'>{title}</p>
      <div>
        <ColorPicker color='#000000' onSelect={() => {}} />
      </div>
    </div>
  );
}
