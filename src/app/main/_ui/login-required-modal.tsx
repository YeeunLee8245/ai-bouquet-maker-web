'use client';

import { useSetAtom } from 'jotai';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { LoginButton } from '@/app/login/_ui/login-button';
import { LOGIN_PROVIDER_LIST } from '@/app/login/_datas';
import { cn } from '@/shared/utils/styles';

export const LOGIN_REQUIRED_MODAL_ID = 'login-required';

export default function LoginRequiredModal({ modalId }: TModalProps) {
  const closeModal = useSetAtom(closeModalAtom);

  return (
    <div
      className='bg-white rounded-4 w-[300px] flex flex-col overflow-hidden'
      style={{ boxShadow: '0 12px 40px rgba(96, 116, 114, 0.18)' }}
    >
      {/* 상단 accent 헤더 */}
      <div className='bg-primary-100 px-5 pt-5 pb-4 flex flex-col items-center gap-1'>
        <p className='text-title-md text-primary-600'>로그인</p>
        <p className='text-body-sm text-primary-400 text-center'>
          간편 로그인이 필요한 서비스 입니다.
        </p>
      </div>

      {/* 로그인 버튼 영역 */}
      <div className='px-4 pt-4 pb-2 flex flex-col gap-2'>
        {LOGIN_PROVIDER_LIST.map((provider) => {
          const { id } = provider;
          return (
            <LoginButton
              key={id}
              provider={provider}
              className={cn(
                id === 'google' && 'bg-white border border-gray-100 rounded-4 transition hover:border-primary-400 hover:shadow-sm [&>span]:left-[11.33px]',
                id === 'kakao' && 'bg-[#FFE400] rounded-4 transition hover:brightness-95 hover:shadow-inner [&>span]:left-[12.3px]',
              )}
            />
          );
        })}
      </div>

      {/* 닫기 */}
      <button
        type='button'
        onClick={() => closeModal(modalId ?? LOGIN_REQUIRED_MODAL_ID)}
        className='w-full py-3 text-body-sm text-gray-400 hover:text-gray-600 transition-colors'
      >
        닫기
      </button>
    </div>
  );
}
