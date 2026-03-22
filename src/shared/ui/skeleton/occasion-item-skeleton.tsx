import Skeleton from './skeleton';

function OccasionItemSkeleton() {
  return (
    <div className='w-[156px] h-[200px] flex flex-col items-center px-4 pt-4 pb-6 gap-3 rounded-5 border-1 border-gray-100 bg-white'>
      <Skeleton className='flex-1 w-full rounded-3' />
      <Skeleton className='h-5 w-16 rounded-2' />
    </div>
  );
}

export default OccasionItemSkeleton;
