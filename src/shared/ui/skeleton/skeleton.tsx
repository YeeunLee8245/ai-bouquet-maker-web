import { cn } from '@/shared/utils/styles';

type TProps = {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: TProps) {
  return (
    <div
      className={cn('animate-pulse rounded-2 bg-gray-100', className)}
      {...props}
    />
  );
}

export default Skeleton;
