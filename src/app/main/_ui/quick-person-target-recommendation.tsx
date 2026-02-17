'use client';

import React, { useRef } from 'react';
import { QUICK_PERSON_TARGET_RECOMMENDATION_LIST } from '../_datas';
import { TRecipient } from '../_types';
import UpArrowIcon from '@/shared/assets/icons/up_arrow.svg';
import Link from 'next/link';

const MOVE_DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
} as const;

type MoveDirection = (typeof MOVE_DIRECTION)[keyof typeof MOVE_DIRECTION];

const MOVE_DIRECTION_ICON_ROTATE_CLASS: Record<MoveDirection, string> = {
  [MOVE_DIRECTION.LEFT]: 'rotate-[-90deg]',
  [MOVE_DIRECTION.RIGHT]: 'rotate-[90deg]',
} as const;

type TProps = {
  recipients?: TRecipient[];
};

export default function QuickPersonTargetRecommendation({ recipients }: TProps) {
  const buttonWrapperRef = useRef<HTMLSpanElement>(null);

  const items = recipients
    ? recipients.map((r) => ({ id: r.id, name: r.label }))
    : [...QUICK_PERSON_TARGET_RECOMMENDATION_LIST];

  const handleClickMove = (direction: MoveDirection) => () => {
    if (!buttonWrapperRef.current) {return;}
    buttonWrapperRef.current.scrollTo({
      left: buttonWrapperRef.current.scrollLeft + (direction === MOVE_DIRECTION.LEFT ? -300 : 300),
      behavior: 'smooth',
    });
  };

  return (
    <div className='flex flex-col gap-3 px-4 pt-1 pb-4'>
      <p className='text-title-md'>빠른 대상 추천</p>
      <span ref={buttonWrapperRef} className='flex gap-2 overflow-y-auto hide-scrollbar'>
        {items.map((item) => (
          <Link href={`/main/quick-recommendation/${item.id}`} key={item.id}
            className='whitespace-nowrap inline-flex items-center justify-center h-[44px] px-4 text-ui-cta-lg text-gray-600 rounded-4 border border-gray-100'
          >
            {item.name}</Link>
        ))}
      </span>
      <div className='flex items-center justify-between'>
        {(Object.values(MOVE_DIRECTION) as MoveDirection[]).map((direction) => (
          <button
            key={direction}
            className='w-6 h-6 bg-primary-100 rounded-full inline-flex items-center justify-center hover:bg-primary-400 hover:text-primary-200'
            onClick={handleClickMove(direction)}
          >
            <UpArrowIcon
              className={`w-3 h-3 text-primary-300 transform ${MOVE_DIRECTION_ICON_ROTATE_CLASS[direction]}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
