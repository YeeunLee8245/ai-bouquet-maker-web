import { cn } from '@/shared/utils/styles';

type TProps = {
  count: number;
  activeIndex: number;
  className?: string;
};

function CarouselIndicator({ count, activeIndex, className }: TProps) {
  return (
    <div className={cn('flex justify-center gap-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn('w-2 h-2 rounded-full', i === activeIndex ? 'bg-gray-100' : 'bg-gray-50 opacity-40')}
        />
      ))}
    </div>
  );
}

export default CarouselIndicator;
