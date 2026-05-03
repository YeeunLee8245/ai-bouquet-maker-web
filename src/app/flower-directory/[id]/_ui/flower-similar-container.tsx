'use client';

import { FlowerCard } from '@/entities/flower/ui';
import React, { useRef, useState, useEffect } from 'react';
import UpArrowIcon from '@/shared/assets/icons/up_arrow.svg';

type TProps = {
  similarFlowers: {
    id: string;
    name: string;
    imageUrl: string;
    tags: string[];
  }[];
  searchParams?: Record<string, string>;
};

function FlowerSimilarContainer({ similarFlowers, searchParams }: TProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) {return;}
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) {return;}
    el.addEventListener('scroll', updateScrollState);
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [similarFlowers]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) {return;}
    el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div className='w-full pt-4 pb-5'>
      <p className='text-title-md px-4 tablet:px-6 pc:px-8'>유사한 꽃</p>
      <div className='relative mt-3'>
        {/* PC 이전 버튼 */}
        <button
          onClick={() => scroll('left')}
          aria-label='이전'
          className={`hidden pc:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <UpArrowIcon className='w-[14px] h-[14px] text-gray-700 rotate-[-90deg]' />
        </button>
        <div ref={scrollRef} className='flex gap-2 overflow-x-scroll hide-scrollbar pc:px-8'>
          {similarFlowers.map((flower) => (
            <FlowerCard
              key={flower.id}
              size='md'
              {...flower}
              searchParams={searchParams}
              className='first:ml-4 last:mr-4 pc:first:ml-0 pc:last:mr-0'
            />
          ))}
        </div>
        {/* PC 다음 버튼 */}
        <button
          onClick={() => scroll('right')}
          aria-label='다음'
          className={`hidden pc:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <UpArrowIcon className='w-[14px] h-[14px] text-gray-700 rotate-[90deg]' />
        </button>
      </div>
    </div>
  );
}

export default FlowerSimilarContainer;
