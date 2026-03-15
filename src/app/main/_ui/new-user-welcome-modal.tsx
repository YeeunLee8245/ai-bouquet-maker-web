'use client';

import { useSetAtom } from 'jotai';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import Link from 'next/link';

function NewUserWelcomeModal({ modalId }: TModalProps) {
  const closeModal = useSetAtom(closeModalAtom);

  return (
    <div className='w-[328px] bg-white border-1 border-gray-100 rounded-5 px-7 py-6 flex flex-col gap-6'>
      <div className='flex flex-col gap-4'>
        <p className='text-body-lg'>🌸 환영해요! 처음 오셨군요.</p>
        <p className='text-body-lg whitespace-pre-wrap'>
          {'꽃다발 레시피를 더 잘 사용하실 수 있도록\n간단한 소개 페이지를 준비했어요.'}
        </p>
        <p className='text-body-lg'>지금 바로 보시겠어요?</p>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <Link
          href='/info'
          onClick={() => closeModal(modalId)}
          className='text-ui-md font-medium underline underline-offset-2'
        >
          지금 소개 보기
        </Link>
        <button
          type='button'
          className='text-ui-md text-gray-400'
          onClick={() => closeModal(modalId)}
        >
          다음에 볼게요
        </button>
      </div>
    </div>
  );
}

export default NewUserWelcomeModal;
