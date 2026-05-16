import Skeleton from './skeleton';

function FlowerCardSkeleton() {
  return (
    <div className='flex flex-col w-full'>
      <div className='block w-full'>
        <Skeleton className='w-full aspect-[156/200] rounded-3' />
      </div>
      <div className='mt-2'>
        <Skeleton className='h-6 w-20 tablet:h-7 tablet:w-24 rounded-2' />
        <div className='flex mt-2 gap-2'>
          <Skeleton className='h-6 w-12 tablet:h-7 tablet:w-14 rounded-full' />
          <Skeleton className='h-6 w-12 tablet:h-7 tablet:w-14 rounded-full' />
        </div>
      </div>
      <Skeleton className='mt-3 h-8 tablet:h-9 w-full rounded-3' />
    </div>
  );
}

export default FlowerCardSkeleton;
