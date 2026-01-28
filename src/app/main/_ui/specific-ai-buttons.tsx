import React from 'react';

import OutlineHeartIcon from '@/shared/assets/icons/outline_heart.svg';
import EmotionFlowerIcon from '@/shared/assets/icons/emotion_flower.svg';
import TargetPersonFlowerIcon from '@/shared/assets/icons/target_person_flower.svg';
import PersonIcon from '@/shared/assets/icons/person.svg';

export default function SpecificAIButtons() {
  return (
    <div className='mt-4 flex items-center gap-4'>
      <button className='bg-gray-100 relative flex-1 h-[116px] rounded-6 p-4 pb-3'>
        <OutlineHeartIcon className='text-gray-100 [&>path]:stroke-primary-300 absolute top-5 left-[19px] w-[18px] h-[18px]' />
        <EmotionFlowerIcon className='absolute bottom-0 right-0' />
        <span className='absolute bottom-3 left-4 text-ui-cta-lg text-primary-600'>감정으로 찾기</span>
      </button>
      <button className='bg-gray-100 relative flex-1 h-[116px] rounded-6 p-4 pb-3'>
        <PersonIcon className='absolute fill-primary-300 top-[19.5px] left-[20px] w-4 h-4' />
        <TargetPersonFlowerIcon className='absolute bottom-0 right-0' />
        <span className='absolute bottom-3 left-4 text-ui-cta-lg text-primary-600'>대상으로 찾기</span>
      </button>

    </div>
  );
}
