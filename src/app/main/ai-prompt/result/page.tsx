'use client';

import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import ChevronDownIcon from '@/shared/assets/icons/chevron_down.svg';
import { FlowerCard } from '@/entities/flower/ui';
import LikeButton from '@/features/like/ui/like-button';
import { SelectButton } from '@features/select-flower';
import { aiRecommendationResultAtom } from '@/entities/recommendation/model/recommendation-result.atoms';

const AiPromptResultPage = () => {
  const router = useRouter();
  const result = useAtomValue(aiRecommendationResultAtom);
  const detailRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!result) {
      router.replace('/main');
    }
  }, [result, router]);

  const handleToggle = () => {
    const detail = detailRef.current;
    const button = buttonRef.current;
    if (!detail || !button) { return; }
    const isExpanded = detail.dataset.isExpanded === 'true';
    detail.dataset.isExpanded = String(!isExpanded);
    button.dataset.isExpanded = String(!isExpanded);
  };

  if (!result) { return null; }

  const { isFree, title, message, recipient, occasion, recommendations } = result;

  const subtitle = occasion ?? (recipient ? `${recipient}에게 전하는 꽃다발` : null);

  return (
    <div className='flex flex-col h-full overflow-y-auto hide-scrollbar'>
      {isFree && (
        <div className='mx-4 mt-4 tablet:mx-6 pc:mx-8 px-3 py-2 border-l-2 border-gray-300'>
          <span className='text-ui-notice text-gray-400'>오늘의 AI 추천 횟수를 모두 사용했어요. 자체 추천 시스템으로 꽃을 추천해 드렸어요. 자정 이후 AI 추천 횟수가 자동으로 충전돼요.</span>
        </div>
      )}
      {/* 추천 정보 헤더 */}
      <div className='pt-4 px-4 tablet:px-6 pc:px-8 pb-2 flex flex-col items-center'>
        <p className='text-title-lg'>{title}</p>
        {subtitle && (
          <div className='flex items-center gap-1 mt-1'>
            <span className='text-body-md text-gray-400'>{subtitle}</span>
            <button
              ref={buttonRef}
              type='button'
              data-is-expanded='true'
              onClick={handleToggle}
              className='transition-transform duration-300 data-[is-expanded=true]:rotate-180'
            >
              <ChevronDownIcon className='w-[12px] h-[12px] stroke-[#CCC] m-1' />
            </button>
          </div>
        )}
        <div
          ref={detailRef}
          data-is-expanded='true'
          className='hidden mt-4 bg-gray-100 rounded-4 py-2 px-3 w-full data-[is-expanded=true]:flex'
        >
          <p className='px-micro pb-micro text-body-md text-gray-400'>
            {message}
          </p>
        </div>
      </div>

      {/* 꽃 목록 */}
      <div className='p-4 tablet:px-6 tablet:pt-6 tablet:pb-8 pc:px-8 grid grid-cols-2 tablet:grid-cols-4 gap-x-4 pc:gap-x-5 gap-y-8 tablet:gap-y-10'>
        {recommendations.map((flower) => (
          <FlowerCard
            key={flower.id}
            size='lg'
            id={flower.id}
            imageUrl={flower.imageUrl ?? '/temp_tulip.png'}
            name={flower.name}
            colors={flower.colors}
            tags={flower.tags}
            likeButton={
              <LikeButton
                type='flower'
                id={flower.id}
                variant='fill'
                size='lg'
              />
            }
            actionButton={
              <SelectButton flowerId={flower.id} flowerName={flower.name} />
            }
          />
        ))}
      </div>
    </div>
  );
};

export default AiPromptResultPage;
