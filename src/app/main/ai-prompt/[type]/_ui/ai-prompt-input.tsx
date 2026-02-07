import React, { useLayoutEffect, useRef } from 'react';
import { AIPromptEventHub } from '../_types';

interface IProps {
  placeholder: string;
  eventHub: AIPromptEventHub;
}

export default function AIPromptInput({ placeholder, eventHub }: IProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {

    // eslint-disable-next-line react-hooks/immutability
    eventHub.onClickGuideItem = (item: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {return;}
      textarea.value = item;
    };
  }, [eventHub]);

  return (
    <div
      className='w-full h-[240px] bg-white rounded-4 pt-2 pb-3 px-[14px] flex flex-col'
    >
      <textarea
        className='flex-1 text-body-md placeholder:text-gray-400 before:content-[attr(data-value)]'
        placeholder={placeholder}
        ref={textareaRef}
      />
      <div className='mt-auto text-[12px] text-gray-400'>/1000자 이내</div>
    </div>
  );
}
