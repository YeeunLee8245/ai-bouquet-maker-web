import React from 'react';
import FlowerSearchSection from './_ui/flower-search-section';
import FlowerFavoritesSection from './_ui/flower-favorites-section';

function FlowerAddModalPage() {
  return (
    <div className='w-full h-[624px] px-4 pt-4 pb-8 rounded-t-5'>
      <div className='flex justify-between px-micro'>
        <p className='text-title-md'>꽃 추가</p>
        <button type='button' className='text-ui-textbtn-md text-gray-400 hover:text-gray-500'>
          닫기
        </button>
      </div>
      <div className='pt-4 pb-6'>
        <FlowerSearchSection />
      </div>
      <FlowerFavoritesSection />
    </div>
  );
}

export default FlowerAddModalPage;
