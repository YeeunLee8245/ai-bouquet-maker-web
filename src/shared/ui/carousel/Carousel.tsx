import useSwipeDrag from '@/shared/hooks/useSwipeDrag';
import React, { cloneElement } from 'react';
import { CarouselProps } from './types';
import useCarousel from './hooks/use-carousel';

function Carousel({ index, length, onIndexChange, children }: CarouselProps) {
  const { items, goPrev, goNext } = useCarousel({ length, index, onIndexChange, children });
  const swipeProps = useSwipeDrag({ onPrev: goPrev, onNext: goNext });

  return (
    <div className='overflow-hidden select-none'>
      <div
        className='flex'
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: 'transform 0.3s ease-in-out',
        }}
        {...swipeProps}
      >
        {items.map((child, i) => (
          <div key={i} className='flex-shrink-0'>
            {cloneElement(child as React.ReactElement, { draggable: false } as React.HTMLAttributes<HTMLElement>)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
