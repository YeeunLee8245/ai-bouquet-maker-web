import React from 'react';
import BouquetPackagingSection from './bouquet-packaging-section';

type TProps = {
  packagingColors: string[];
  ribbonColors: string[];
};

export default function MakeBouquetPackagingContainer({ packagingColors, ribbonColors }: TProps) {
  return (
    <div className='mt-4 p-4 border-1 border-gray-100 rounded-5 bg-white'>
      <p className='text-title-md px-micro'>포장 옵션</p>
      <div className='mt-3 px-micro grid grid-cols-1 grid-rows-2 gap-y-4'>
        <BouquetPackagingSection title='포장지' defaultColors={packagingColors} />
        <BouquetPackagingSection title='리본' defaultColors={ribbonColors} />
      </div>
    </div>
  );
}
