'use client';

import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { withAsyncClick } from '@/shared/ui/button';
import { postWithdraw } from '@api/auth.api';

export const WITHDRAW_MODAL_ID = 'withdraw';

const LoadingButton = withAsyncClick(
  ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
);

export default function WithdrawModal({ modalId }: TModalProps) {
  const closeModal = useSetAtom(closeModalAtom);
  const router = useRouter();

  const handleWithdraw = async () => {
    await postWithdraw();
    closeModal(modalId ?? WITHDRAW_MODAL_ID);
    router.replace('/');
  };

  return (
    <div
      className='bg-white rounded-4 w-[300px] flex flex-col overflow-hidden'
      style={{ boxShadow: '0 12px 40px rgba(96, 116, 114, 0.18)' }}
    >
      {/* 상단 accent 헤더 */}
      <div className='bg-gray-50 px-5 pt-5 pb-4 flex flex-col items-center gap-1'>
        <p className='text-title-md text-gray-700'>계정 탈퇴</p>
        <p className='text-body-sm text-gray-400 text-center'>
          탈퇴하면 저장된 꽃다발이 모두 삭제되며<br />복구할 수 없어요.
        </p>
      </div>

      {/* 탈퇴 확인 버튼 */}
      <div className='px-4 pt-4 pb-2'>
        <LoadingButton
          type='button'
          className='w-full h-[46px] rounded-4 bg-red-50 text-red-400 text-ui-textbtn-lg transition hover:bg-red-100 disabled:opacity-50'
          onClick={handleWithdraw}
          loadingText='처리 중...'
          errorText='탈퇴 처리 중 오류가 발생했습니다.'
        >
          탈퇴하기
        </LoadingButton>
      </div>

      {/* 닫기 */}
      <button
        type='button'
        onClick={() => closeModal(modalId ?? WITHDRAW_MODAL_ID)}
        className='w-full py-3 text-body-sm text-gray-400 hover:text-gray-600 transition-colors'
      >
        닫기
      </button>
    </div>
  );
}
