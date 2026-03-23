'use client';

import React from 'react';

import ChevronDownIcon from '@/shared/assets/icons/chevron_down.svg';
import { FlowerCard } from '@/entities/flower/ui';
import { testDirectoryItem } from '@/app/flower-directory/_datas';
import { SelectButton } from '@features/select-flower';

const AiPromptResultPage = () => {
  const detailRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    const detail = detailRef.current;
    const button = buttonRef.current;
    if (!detail || !button) {return;}
    const isExpanded = detail.dataset.isExpanded === 'true';
    detail.dataset.isExpanded = String(!isExpanded);
    button.dataset.isExpanded = String(!isExpanded);
  };

  return (
    <div className='flex flex-col h-full overflow-y-auto hide-scrollbar'>
      {/* 주문 정보 */}
      <div className='pt-4 px-4 pb-2 flex flex-col items-center'>
        <p className='text-title-lg'>예은님에게 이런 꽃을 추천할게요!</p>
        <div className='flex items-center gap-1 mt-1'>
          <span className='text-body-md text-gray-400'>여동생에게 전하는 꽃다발</span>
          <button ref={buttonRef} type='button' data-is-expanded='true' onClick={handleToggle}
            className='transition-transform duration-300 data-[is-expanded=true]:rotate-180'>
            <ChevronDownIcon className='w-[12px] h-[12px] stroke-[#CCC] m-1' />
          </button>
        </div>
        <div ref={detailRef} data-is-expanded='true'
          className='hidden mt-4 bg-gray-100 rounded-4 py-2 px-3 w-full data-[is-expanded=true]:flex'>
          <p className='px-micro pb-micro text-body-md text-gray-400'>
            30대 초반 여동생, 차분하고 지적인 성격이며 보라색과 흰색을 좋아해요. 대학원 졸업 축하 선물로 주려고 해요.
          </p>
        </div>
      </div>
      {/* 꽃 목록 */}
      <div className='p-4 grid grid-cols-2 gap-x-4 gap-y-8 '>
        {/* TODO: yeeun API 응답으로 변경, entities로 빼기 */}
        {Array.from({ length: 10 }).map((_, index) => (
          <FlowerCard
            key={index}
            size='lg'
            {...testDirectoryItem}
            actionButton={<SelectButton flowerId={testDirectoryItem.id} flowerName={testDirectoryItem.name} />}/>
        ))}
      </div>
    </div>
  );
};

export default AiPromptResultPage;
