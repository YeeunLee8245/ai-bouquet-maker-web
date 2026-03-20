'use client';

import EmotionFlowerIcon from '@/shared/assets/icons/emotion_flower.svg';

function AIAnalyzingModal() {
  return (
    <div className='bg-white rounded-4 px-10 py-8 flex flex-col items-center gap-4 animate-fade-in'>
      <EmotionFlowerIcon aria-hidden='true' className='w-[56px] h-[56px] fill-primary-300 animate-spin' />
      <p className='text-body-md text-gray-400'>꽃을 고르는 중이에요...</p>
    </div>
  );
}

export default AIAnalyzingModal;
