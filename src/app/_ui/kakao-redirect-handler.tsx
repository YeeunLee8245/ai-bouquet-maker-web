'use client';

import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { showToastAtom } from '@/shared/model/toast';
import LogoIcon from '@/shared/assets/icons/logo.svg';
import { Button } from '@/shared/ui/button';

export default function KakaoRedirectHandler() {
  const [isKakao, setIsKakao] = useState(false);
  const showToast = useSetAtom(showToastAtom);

  useEffect(() => {
    if (typeof window === 'undefined') { return; }

    const userAgent = navigator.userAgent.toLowerCase();
    const isKakaoTalk = userAgent.includes('kakaotalk');

    if (isKakaoTalk) {
      setIsKakao(true);
      const currentUrl = window.location.href;

      // Attempt redirect immediately
      const redirectUrl = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
      window.location.href = redirectUrl;
    }
  }, []);

  const handleOpenExternal = () => {
    const currentUrl = window.location.href;
    const redirectUrl = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
    window.location.href = redirectUrl;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast({ message: '주소가 클립보드에 복사되었습니다.' });
    } catch {
      showToast({ message: '주소 복사에 실패했습니다. 직접 복사해주세요.' });
    }
  };

  if (!isKakao) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes customPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.15;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.35;
          }
        }
        @keyframes floatEffect {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-custom-pulse {
          animation: customPulse 2s infinite ease-in-out;
        }
        .animate-float {
          animation: floatEffect 3s infinite ease-in-out;
        }
      `}</style>
      <div className='fixed inset-0 z-[99999] bg-[#F5F5F4] flex flex-col justify-between px-6 py-14 select-none'>
        <div className='flex-1 flex flex-col items-center justify-center text-center'>
          {/* Animated icon container */}
          <div className='relative mb-10 flex items-center justify-center'>
            {/* Subtle floating background glow */}
            <div className='absolute w-32 h-32 bg-[#DDE4E3] rounded-full animate-custom-pulse blur-xl' />
            <div className='relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#CCD6D6] animate-float'>
              <LogoIcon className='w-10 h-10 fill-[#607472]' />
            </div>
          </div>

          {/* Title and Descriptions */}
          <h1 className='text-title-lg font-semibold text-[#2B2D24] mb-3 tracking-tight'>
            외부 브라우저로 연결합니다
          </h1>
          <p className='text-body-sm text-[#808789] max-w-[290px] leading-relaxed mb-8'>
            카카오톡 인앱 브라우저에서는 일부 로그인 기능이 제한될 수 있어, 더 원활한 이용을 위해 외부 브라우저(Safari, Chrome 등)로 자동 연결 중입니다.
          </p>

          {/* Loading Indicator */}
          <div className='flex items-center gap-2 py-2.5 px-5 rounded-full bg-[#DDE4E3] text-[#607472] text-ui-cta-sm font-medium'>
            <span className='w-1.5 h-1.5 bg-[#607472] rounded-full animate-bounce [animation-delay:-0.3s]' />
            <span className='w-1.5 h-1.5 bg-[#607472] rounded-full animate-bounce [animation-delay:-0.15s]' />
            <span className='w-1.5 h-1.5 bg-[#607472] rounded-full animate-bounce' />
            자동 이동 중...
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col gap-3.5 w-full max-w-sm mx-auto'>
          <Button size='lg' onClick={handleOpenExternal} className='shadow-md font-semibold bg-[#78918F] hover:bg-[#607472]'>
            기본 브라우저로 열기
          </Button>
          <button
            type='button'
            onClick={handleCopyLink}
            className='w-full h-[44px] tablet:h-[48px] rounded-4 border border-[#CACDCE] text-ui-cta-lg text-[#2B2D24] bg-white hover:bg-[#EAEBEB] transition-colors cursor-pointer font-medium'
          >
            주소 복사하기
          </button>
        </div>
      </div>
    </>
  );
}
