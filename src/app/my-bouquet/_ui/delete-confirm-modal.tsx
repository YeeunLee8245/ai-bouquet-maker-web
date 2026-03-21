'use client';

import { useSetAtom } from 'jotai';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { useDeleteBouquetMutation } from '../_model/use-delete-bouquet-mutation';
import { Button } from '@/shared/ui/button';

type Props = TModalProps & {
  bouquetId: string;
  onSuccess?: () => void;
};

export default function DeleteConfirmModal({ modalId, bouquetId, onSuccess }: Props) {
  const closeModal = useSetAtom(closeModalAtom);
  const { mutate, isPending } = useDeleteBouquetMutation(() => {
    onSuccess?.();
    closeModal(modalId);
  });

  const handleConfirm = () => {
    mutate(bouquetId);
  };

  return (
    <div className='w-[328px] bg-white border-1 border-gray-100 rounded-5 px-7 py-6 flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <p className='text-title-sm'>꽃다발을 삭제할까요?</p>
        <p className='text-body-md text-gray-400'>삭제된 꽃다발은 복구할 수 없어요.</p>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <Button
          type='button'
          onClick={handleConfirm}
          disabled={isPending}
          size={'lg'}
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
