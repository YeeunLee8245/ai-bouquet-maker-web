'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { SearchInput } from '@/shared/ui/input';
import { aiRecommendationResultAtom } from '@/app/main/ai-prompt/_model/recommendation-result.atoms';
import { showToastAtom } from '@/shared/model/toast';
import { openModalAtom, closeModalAtom } from '@/shared/model/modal';
import AIAnalyzingModal, { AI_ANALYZING_MODAL_ID } from '@/app/main/ai-prompt/[type]/_ui/ai-analyzing-modal';
import LoginRequiredModal, { LOGIN_REQUIRED_MODAL_ID } from './login-required-modal';
import { useWalletBalance } from '@/shared/hooks/useWalletBalance';

export default function GeneralAIInput() {
  const [value, setValue] = useState('');
  const router = useRouter();
  const setRecommendationResult = useSetAtom(aiRecommendationResultAtom);
  const showToast = useSetAtom(showToastAtom);
  const openModal = useSetAtom(openModalAtom);
  const closeModal = useSetAtom(closeModalAtom);
  const { isTokenEmpty } = useWalletBalance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isTokenEmpty) {
      showToast({ message: '일일 토큰이 모두 소진 되었어요. 자정 이후 토큰이 자동 충전됩니다.' });
      return;
    }

    const text = value.trim();

    if (text.length < 10) {
      showToast({ message: '더 자세히 설명해주세요. (최소 10자)' });
      return;
    }

    openModal({
      id: AI_ANALYZING_MODAL_ID,
      position: 'center',
      canCloseOnBackgroundClick: false,
      component: <AIAnalyzingModal />,
    });

    try {
      const response = await fetch('/api/recommend/ai/general', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          openModal({
            id: LOGIN_REQUIRED_MODAL_ID,
            position: 'center',
            component: <LoginRequiredModal modalId={LOGIN_REQUIRED_MODAL_ID} />,
          });
        } else {
          showToast({ message: data.error ?? '추천 중 오류가 발생했습니다.' });
        }
        return;
      }

      setRecommendationResult({
        recommendationId: data.recommendationId,
        title: data.title,
        message: data.message,
        recipient: data.recipient,
        occasion: data.occasion,
        inputText: text,
        recommendations: data.recommendations,
      });

      router.push('/main/ai-prompt/result');
    } catch {
      showToast({ message: '추천 중 오류가 발생했습니다.' });
    } finally {
      // login-required modal (if opened on 401) remains; only the analyzing overlay is dismissed
      closeModal(AI_ANALYZING_MODAL_ID);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='relative mt-2 w-full'>
      {value.length > 0 && (
        <div className='absolute bottom-full mb-2 right-0 whitespace-nowrap'>
          <div className='relative bg-gray-800 text-white text-[12px] leading-none rounded-2 px-3 py-2'>
            입력이 끝나면 Enter를 입력해주세요.
            <span className='absolute top-full right-4 border-4 border-transparent border-t-gray-800' />
          </div>
        </div>
      )}
      <SearchInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='친구의 새로운 시작을 응원하고 싶어요.'
        className='h-[40px]'
        enterKeyHint='search'
      />
    </form>
  );
}
