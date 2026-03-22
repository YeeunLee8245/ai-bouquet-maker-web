import Skeleton from './skeleton';

function FlowerCardSkeleton() {
  return (
    <div className='flex flex-col min-w-[156px]'>
      <Skeleton className='w-[156px] h-[200px] rounded-3' />
      <div className='mt-2'>
        <Skeleton className='h-5 w-20 rounded-2' />
        <div className='flex mt-2 gap-2'>
          <Skeleton className='h-5 w-12 rounded-full' />
          <Skeleton className='h-5 w-12 rounded-full' />
        </div>
      </div>
    </div>
  );
}

export default FlowerCardSkeleton;
