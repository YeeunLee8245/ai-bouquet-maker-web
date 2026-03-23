import Skeleton from '@/shared/ui/skeleton/skeleton';

function BouquetDetailSkeleton() {
  return (
    <div>
      <div className='p-4 flex items-end justify-between'>
        <Skeleton className='h-7 w-40' />
        <Skeleton className='h-8 w-24' />
      </div>
      <div className='flex flex-col gap-4 px-4 pb-6'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='info-border flex flex-col gap-3'>
            <Skeleton className='h-5 w-20' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
          </div>
        ))}
      </div>
      <div className='px-4 pb-8 flex flex-col items-center'>
        <Skeleton className='h-12 w-full' />
        <Skeleton className='h-5 w-20' />
      </div>
    </div>
  );
}

export default BouquetDetailSkeleton;
