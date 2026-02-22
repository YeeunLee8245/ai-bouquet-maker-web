'use client';

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { AI_PROMPT_DATA_MAP, AI_PROMPT_DATAS } from './_datas';
import { AIPromptType, AIPromptPageParams, AIPromptEventHub } from './_types';
import OutlineHeartIcon from '@/shared/assets/icons/outline_heart.svg';
import PersonIcon from '@/shared/assets/icons/person.svg';
import { cloneElement } from 'react';
import AIPromptInput from './_ui/ai-prompt-input';
import { Button } from '@/shared/ui/button';
import AIPromptGuideContainer from './_ui/ai-prompt-guide-container';

/**
 * AI 프롬프트 페이지
 *
 * @param params.type - 'emotion' | 'recipient'
 *
 * emotion: 감정으로 찾기, recipient: 대상으로 찾기
 *
 */
function AIPromptPage() {
  const params = useParams<AIPromptPageParams>();
  const type = params.type as AIPromptType;

  if (!AI_PROMPT_DATAS.includes(type)) {
    notFound();
  }

  let IconComponent = null;
  switch (type) {
    case 'emotion':
      IconComponent = <OutlineHeartIcon className='stroke-primary-300 fill-gray-50' />;
      break;
    case 'recipient':
      IconComponent = <PersonIcon className='fill-primary-300' />;
      break;
  }

  const eventHub: AIPromptEventHub = {
    onClickGuideItem: undefined,
  };

  const { title, description, placeholder, guide } = AI_PROMPT_DATA_MAP[type];

  return (
    <div className='flex flex-col h-full overflow-y-auto hide-scrollbar'>
      <div className='pt-4 pb-2 px-4'>
        {
          IconComponent && (cloneElement(IconComponent, { className: `${IconComponent.props.className} w-[18px] h-[18px] ml-[4.4px] my-1` }))
        }
        <div className='ml-1'>
          <div className='mt-3 text-title-lg'>{title}</div>
          <div className='mt-1 text-body-md text-gray-400 whitespace-pre-wrap'>{description}</div>
        </div>
      </div>
      <div className='pt-4 px-4 pb-8 flex flex-col gap-4'>
        <AIPromptInput eventHub={eventHub} placeholder={placeholder} />
        <Button size='lg'>꽃 추천 받기</Button>
      </div>
      <AIPromptGuideContainer eventHub={eventHub} guide={guide} />
    </div>
  );
}

export default AIPromptPage;
