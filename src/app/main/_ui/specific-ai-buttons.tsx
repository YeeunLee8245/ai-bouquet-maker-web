import React from 'react';

import OutlineHeartIcon from '@/shared/assets/icons/outline_heart.svg';
import EmotionFlowerIcon from '@/shared/assets/icons/emotion_flower.svg';
import TargetPersonFlowerIcon from '@/shared/assets/icons/target_person_flower.svg';
import PersonIcon from '@/shared/assets/icons/person.svg';
import Link from 'next/link';

const AI_BUTTON_ITEMS = [
  {
    type: 'emotion',
    icon: OutlineHeartIcon,
    iconClassName: 'text-gray-100 [&>path]:stroke-primary-300 absolute top-5 left-[19px] w-[18px] h-[18px]',
    flowerIcon: EmotionFlowerIcon,
    label: '감정으로 찾기',
  },
  {
    type: 'recipient',
    icon: PersonIcon,
    iconClassName: 'absolute fill-primary-300 top-[19.5px] left-[20px] w-4 h-4',
    flowerIcon: TargetPersonFlowerIcon,
    label: '대상으로 찾기',
  },
] as const;

export default function SpecificAIButtons() {
  return (
    <div className='mt-4 flex items-center gap-4'>
      {AI_BUTTON_ITEMS.map((item) => {
        const IconComponent = item.icon;
        const FlowerIconComponent = item.flowerIcon;

        return (
          <Link
            key={item.type}
            href={`/main/ai-prompt/${item.type}`}
            className='bg-gray-100 relative flex-1 h-[116px] rounded-6 p-4 pb-3'
          >
            <IconComponent className={item.iconClassName} />
            <FlowerIconComponent className='absolute bottom-0 right-0' />
            <span className='absolute bottom-3 left-4 text-ui-cta-lg text-primary-600'>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
