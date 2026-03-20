import React, { useLayoutEffect, useRef } from 'react';
import { AIPromptEventHub } from '../_types';
import { updateTextCount } from '@/shared/utils/dom';

interface IProps {
  placeholder: string;
  eventHub: AIPromptEventHub;
}

const MAX_TEXT_LENGTH = 1000;

export default function AIPromptInput({ placeholder, eventHub }: IProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textCountRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {

    // eslint-disable-next-line react-hooks/immutability
    eventHub.onClickGuideItem = (item: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {return;}
      textarea.value = item;

      updateTextCount(textCountRef, item.length);
    };

    eventHub.getInputText = () => textareaRef.current?.value ?? '';
  }, [eventHub]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateTextCount(textCountRef, e.target.value.length);
  };

  return (
    <div
      className='w-full h-[240px] bg-white rounded-4 pt-2 pb-3 px-[14px] flex flex-col'
    >
      <textarea
        className='flex-1 text-body-md placeholder:text-gray-400 before:content-[attr(data-value)]'
        placeholder={placeholder}
        ref={textareaRef}
        onChange={handleChange}
        maxLength={MAX_TEXT_LENGTH}
      />
      <div
        ref={textCountRef}
        data-count='0'
        className='mt-auto text-[12px] text-gray-400 before:content-[attr(data-count)]'
      >
        /1000자 이내
      </div>
    </div>
  );
}
