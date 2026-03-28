'use client';

import { useSetAtom } from 'jotai';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { deleteBouquetBulk } from '@api/recipe-bouquet.api';
import { Button, withAsyncClick } from '@/shared/ui/button';

type Props = TModalProps & {
  bouquetIds: string[];
  onSuccess: () => void;
};

const LoadingButton = withAsyncClick(Button);

export default function BulkDeleteConfirmModal({ modalId, bouquetIds, onSuccess }: Props) {
  const closeModal = useSetAtom(closeModalAtom);

  const handleConfirm = async () => {
    await deleteBouquetBulk(bouquetIds);
    onSuccess();
    closeModal(modalId);
  };

  return (
    <div className='w-[328px] bg-white border-1 border-gray-100 rounded-5 px-7 py-6 flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <p className='text-title-sm'>{bouquetIds.length}개의 꽃다발을 삭제할까요?</p>
        <p className='text-body-md text-gray-400'>삭제된 꽃다발은 복구할 수 없어요.</p>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <LoadingButton
          type='button'
          size='lg'
          onClick={handleConfirm}
          loadingText='삭제 중...'
          errorText='삭제 중 오류가 발생했어요. 다시 시도해 주세요.'
        >
          삭제하기
        </LoadingButton>
        <button
          type='button'
          aria-label='취소'
          onClick={() => closeModal(modalId)}
          className='text-ui-md text-gray-400'
        >
          취소
        </button>
      </div>
    </div>
  );
}
