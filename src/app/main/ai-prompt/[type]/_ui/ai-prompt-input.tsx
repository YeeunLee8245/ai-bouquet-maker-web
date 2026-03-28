import React, { useLayoutEffect, useRef } from 'react';
import { AIPromptEventHub } from '../_types';
import { updateTextCount } from '@/shared/utils/dom';

interface IProps {
  placeholder: string;
  eventHub: AIPromptEventHub;
  disabled?: boolean;
}

const MAX_TEXT_LENGTH = 1000;

export default function AIPromptInput({ placeholder, eventHub, disabled }: IProps) {
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
    <div className='relative w-full h-[240px] bg-white rounded-4 pt-2 pb-3 px-[14px] flex flex-col'>
      {disabled && (
        <div className='absolute inset-0 rounded-4 bg-white/80 flex items-center justify-center z-10'>
          <span className='text-body-md text-gray-400 text-center'>일일 토큰이 모두 소진 되었어요. <br />자정 이후 토큰이 자동 충전됩니다.</span>
        </div>
      )}
      <textarea
        className='flex-1 text-body-md placeholder:text-gray-400 before:content-[attr(data-value)]'
        placeholder={placeholder}
        ref={textareaRef}
        onChange={handleChange}
        maxLength={MAX_TEXT_LENGTH}
        disabled={disabled}
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
