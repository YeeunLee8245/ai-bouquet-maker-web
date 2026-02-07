import React from 'react';

interface IProps {
  placeholder: string;
}

export default function AIPromptInput({ placeholder }: IProps) {
  return (
    <div className='w-full h-[240px] bg-white rounded-4 pt-2 pb-3 px-[14px] flex flex-col'>
      <textarea className='flex-1 text-body-md placeholder:text-gray-400' placeholder={placeholder} />
      <div className='mt-auto text-[12px] text-gray-400'>/1000자 이내</div>
    </div>
  );
}
