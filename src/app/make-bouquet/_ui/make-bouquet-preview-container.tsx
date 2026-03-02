'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { canSaveBouquetAtom, firstValidationErrorAtom } from '../_model';
import { showToastAtom } from '@/shared/model/toast';

export default function MakeBouquetPreviewContainer() {
  const canSave = useAtomValue(canSaveBouquetAtom);
  const firstError = useAtomValue(firstValidationErrorAtom);
  const showToast = useSetAtom(showToastAtom);

  const handleClick = () => {
    if (!canSave) {
      if (firstError) {
        showToast({ message: firstError });
      }
      return;
    }
    showToast({ message: '미리보기 준비 중입니다.' });
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
