import React from 'react';
import BouquetPackagingSection from './bouquet-packaging-section';

export default function MakeBouquetPackagingContainer() {
  return (
    <div className='mt-4 p-4 border-1 border-gray-100 rounded-5 bg-white'>
      <p className='text-title-md px-micro'>포장 옵션</p>
      <div className='mt-3 px-micro grid grid-cols-1 grid-rows-2 gap-y-4'>
        <BouquetPackagingSection />
        <BouquetPackagingSection />
      </div>
    </div>
  );
}
