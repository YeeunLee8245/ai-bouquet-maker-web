'use client';

import { useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import ChevronDownIcon from '@/shared/assets/icons/chevron_down.svg';
import { FlowerCard } from '@/entities/flower/ui';
import { Button } from '@/shared/ui/button';
import LikeButton from '@/features/like/ui/like-button';
import { resetSelectedFlowersAtom, selectedFlowersAtom, toggleFlowerAtom } from '@/shared/model/selected-flowers';
import { aiRecommendationResultAtom } from '../_model/recommendation-result.atoms';

function SelectButton({ flowerId, flowerName }: { flowerId: string; flowerName: string }) {
  const selectedFlowers = useAtomValue(selectedFlowersAtom);
  const toggleFlower = useSetAtom(toggleFlowerAtom);
  const isSelected = selectedFlowers.some((f) => f.id === flowerId);

  return (
    <Button
      size='md'
      className={isSelected ? 'mt-3 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-600 hover:fill-gray-600' : 'mt-3'}
      onClick={() => toggleFlower({ id: flowerId, name: flowerName })}
    >
      {isSelected ? '선택 취소' : '선택하기'}
    </Button>
  );
}

const AiPromptResultPage = () => {
  const router = useRouter();
  const resetSelectedFlowers = useSetAtom(resetSelectedFlowersAtom);
  const result = useAtomValue(aiRecommendationResultAtom);
  const detailRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    resetSelectedFlowers();
  }, []);

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

  const { title, message, recipient, occasion, recommendations } = result ?? {};

  const subtitle = occasion ?? (recipient ? `${recipient}에게 전하는 꽃다발` : null);

  return (
    <div className='flex flex-col h-full overflow-y-auto hide-scrollbar'>
      {/* 추천 정보 헤더 */}
      <div className='pt-4 px-4 pb-2 flex flex-col items-center'>
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
      <div className='p-4 grid grid-cols-2 gap-x-4 gap-y-8'>
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
