import React from 'react';
import FlowerSearchSection from './_ui/flower-search-section';
import FlowerFavoritesSection from './_ui/flower-favorites-section';
import BottomActionFooter from '@/widgets/footer/BottomActionFooter';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { useSetAtom } from 'jotai';

function FlowerAddModal({ modalId }: TModalProps) {
  const closeModal = useSetAtom(closeModalAtom);

  return (
    <div className='bg-gray-50 relative flex flex-col max-w-[360px] min-h-[624px] rounded-t-5'>
      <div className='w-full flex-1 px-4 pt-4 rounded-t-5'>
        <div className='flex justify-between px-micro'>
          <p className='text-title-md'>꽃 추가</p>
          <button
            type='button'
            className='text-ui-textbtn-md text-gray-400 hover:text-gray-500'
            onClick={() => closeModal(modalId)}
          >
            닫기
          </button>
        </div>
        <div className='pt-4 pb-6'>
          <FlowerSearchSection />
        </div>
        <FlowerFavoritesSection />
      </div>
      <BottomActionFooter title='꽃다발 담기' />
    </div>
  );
}

export default FlowerAddModal;
