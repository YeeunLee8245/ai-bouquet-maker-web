'use client';

import { useSetAtom } from 'jotai';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import BouquetPreviewSection from './bouquet-preview-section';
import type { IBouquetDetailData, IBouquetDetailFlower } from '../_types';

type TProps = TModalProps & {
  flowers: IBouquetDetailFlower[];
  layout: IBouquetDetailData['layout'];
};

export default function BouquetPreviewModal({ modalId, flowers, layout }: TProps) {
  const closeModal = useSetAtom(closeModalAtom);

  return (
    <div className='flex flex-col w-[360px] bg-gray-50 rounded-t-5'>
      <div className='flex justify-between items-center px-4 pt-4 pb-2'>
        <p className='text-title-md px-micro'>꽃다발 미리보기</p>
        <button
          type='button'
          className='text-ui-textbtn-md text-gray-400 hover:text-gray-500'
          onClick={() => closeModal(modalId)}
        >
          닫기
        </button>
      </div>
      <div className='px-4 pb-6'>
        <BouquetPreviewSection flowers={flowers} layout={layout} />
      </div>
    </div>
  );
}
