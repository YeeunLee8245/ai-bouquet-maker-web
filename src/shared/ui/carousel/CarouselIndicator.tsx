import { cn } from '@/shared/utils/styles';

type TProps = {
  count: number;
  activeIndex: number;
  className?: string;
};

function CarouselIndicator({ count, activeIndex, className }: TProps) {
  return (
    <div className={cn('flex justify-center gap-2 mt-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn('w-4 h-4 rounded-full', i === activeIndex ? 'bg-primary' : 'bg-gray-300')}
        />
      ))}
    </div>
  );
}

export default CarouselIndicator;
