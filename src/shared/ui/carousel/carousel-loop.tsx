import useSwipeDrag from '@/shared/hooks/useSwipeDrag';
import useLoopCarousel from './hooks/use-loop-carousel';
import { CarouselProps } from './types';
import { cloneElement } from 'react';

function Carousel({ index, length, onIndexChange, children }: CarouselProps) {
  const { items, renderIdx, isAnimating, goPrev, goNext, onTransitionEnd } = useLoopCarousel({ length, index, onIndexChange, children });
  const swipeProps = useSwipeDrag({ onPrev: goPrev, onNext: goNext });

  return (
    <div className='overflow-hidden select-none'>
      <div
        className='flex'
        style={{
          transform: `translateX(-${renderIdx * 100}%)`,
          transition: isAnimating ? 'transform 0.3s ease-in-out' : 'none',
        }}
        onTransitionEnd={onTransitionEnd}
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
