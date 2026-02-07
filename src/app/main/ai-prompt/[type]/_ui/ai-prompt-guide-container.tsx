import React from 'react';
import { AIPromptGuide } from '../_types';

interface IProps {
  guide: AIPromptGuide;
}

export default function AIPromptGuideContainer({ guide }: IProps) {
  const { title, items } = guide;
  return (
    <div className='border-t-2 border-gray-100 pt-4 px-4 pb-8'>
      <div className='text-body-md text-center mt-2'>{title}</div>
      <div className='mt-5 flex flex-col gap-2'>
        {items.map((item, index) => (
          <button
            key={index}
            className='py-2 px-3 rounded-4 bg-white text-body-md border border-gray-100 transition-all hover:border-primary-300 hover:bg-primary-50 active:border-primary-400 active:bg-primary-100'
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
