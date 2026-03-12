'use client';

import { useSetAtom } from 'jotai';
import { openModalAtom } from '@/shared/model/modal';
import BouquetPreviewModal from './modals/bouquet-preview-modal/bouquet-preview-modal';

export default function MakeBouquetPreviewContainer() {
  const openModal = useSetAtom(openModalAtom);

  const handleClick = () => {
    openModal({
      id: 'bouquet-preview-modal',
      component: <BouquetPreviewModal />,
      position: 'bottom',
    });
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      aria-label='꽃다발 미리보기'
      className='mt-4 p-4 w-full border-1 border-gray-100 rounded-5 bg-white text-start hover:border-gray-200 hover:shadow-sm'
    >
      <p className='text-title-md px-micro'>꽃다발 미리보기</p>
      <p className='mt-1 text-body-md text-gray-400 px-micro whitespace-pre-wrap'>{'실제 꽃다발은 플로리스트가 더 예쁘게\n만들어 드려요.'}</p>
    </button>
  );
}
