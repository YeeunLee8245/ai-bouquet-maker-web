import Skeleton from '@/shared/ui/skeleton/skeleton';

function BouquetListSkeleton() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-4 px-micro pt-4 pb-2 flex items-center justify-between'>
        <Skeleton className='h-7 w-24' />
        <Skeleton className='h-8 w-28' />
      </div>
      <div className='h-[2px] w-full bg-gray-100' />
      <div className='pt-4 px-4 pb-8 flex flex-col gap-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='info-border flex flex-col'>
            <Skeleton className='h-6 w-40' />
            <div className='mt-3 flex flex-col gap-1'>
              <div className='flex items-center justify-between'>
                <Skeleton className='h-4 w-10' />
                <Skeleton className='h-4 w-24' />
              </div>
              <div className='flex items-center justify-between'>
                <Skeleton className='h-4 w-16' />
                <Skeleton className='h-4 w-20' />
              </div>
            </div>
            <div className='my-3 w-full h-px bg-gray-100' />
            <div className='flex items-center gap-1 mb-2'>
              <Skeleton className='h-4 w-4 rounded-full' />
              <Skeleton className='h-4 w-20' />
            </div>
            <Skeleton className='w-full h-[40px] rounded-4' />
            <div className='mt-4'>
              <div className='flex items-center gap-1 mb-2'>
                <Skeleton className='h-4 w-4 rounded-full' />
                <Skeleton className='h-4 w-16' />
              </div>
              <div className='flex gap-2'>
                <Skeleton className='h-[56px] w-[80px] rounded-4' />
                <Skeleton className='h-[56px] w-[80px] rounded-4' />
                <Skeleton className='h-[56px] w-[80px] rounded-4' />
              </div>
            </div>
            <div className='mt-3 flex items-center justify-between'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-24' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BouquetListSkeleton;
