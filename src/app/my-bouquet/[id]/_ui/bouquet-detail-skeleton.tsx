import Skeleton from '@/shared/ui/skeleton/skeleton';

function BouquetDetailSkeleton() {
  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='p-4 tablet:px-6 pc:px-8 flex items-end justify-between'>
        <Skeleton className='h-7 w-40' />
        <Skeleton className='h-8 w-24' />
      </div>
      <div className='h-px bg-gray-100' />
      <div className='flex flex-col gap-6 px-4 tablet:px-6 pc:px-8 pt-4 pb-8'>
        <div className='flex flex-col gap-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='info-border flex flex-col gap-3'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
            </div>
          ))}
        </div>
        <div className='flex flex-col gap-3 items-center'>
          <Skeleton className='h-12 w-full rounded-4' />
          <Skeleton className='h-5 w-20' />
        </div>
      </div>
    </div>
  );
}

export default BouquetDetailSkeleton;
