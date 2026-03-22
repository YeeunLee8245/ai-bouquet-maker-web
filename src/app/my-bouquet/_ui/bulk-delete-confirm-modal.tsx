'use client';

import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { showToastAtom } from '@/shared/model/toast';
import { deleteBouquet } from '@api/recipe-bouquet.api';
import { Button } from '@/shared/ui/button';
import { isApiError } from '@/shared/api';

type Props = TModalProps & {
  bouquetIds: string[];
  onSuccess: () => void;
};

export default function BulkDeleteConfirmModal({ modalId, bouquetIds, onSuccess }: Props) {
  const closeModal = useSetAtom(closeModalAtom);
  const showToast = useSetAtom(showToastAtom);
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      // TODO: yeeun 삭제 API 개선 문의
      await Promise.all(bouquetIds.map((id) => deleteBouquet(id)));
      onSuccess();
      closeModal(modalId);
    } catch (error: unknown) {
      // TODO: yeeun api 에러 공통처리
      const apiError = isApiError(error) ? error : undefined;
      showToast({ message: `삭제 중 오류가 발생했어요. 다시 시도해 주세요. (code: ${apiError?.code})` });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className='w-[328px] bg-white border-1 border-gray-100 rounded-5 px-7 py-6 flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <p className='text-title-sm'>{bouquetIds.length}개의 꽃다발을 삭제할까요?</p>
        <p className='text-body-md text-gray-400'>삭제된 꽃다발은 복구할 수 없어요.</p>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <Button
          type='button'
          onClick={handleConfirm}
          disabled={isPending}
          size='lg'
        >
          {isPending ? '삭제 중...' : '삭제하기'}
        </Button>
        <button
          type='button'
          aria-label='취소'
          onClick={() => closeModal(modalId)}
          disabled={isPending}
          className='text-ui-md text-gray-400'
        >
          취소
        </button>
      </div>
    </div>
  );
}
