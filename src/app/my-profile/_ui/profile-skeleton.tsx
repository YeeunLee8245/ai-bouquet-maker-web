import Skeleton from '@/shared/ui/skeleton/skeleton';

function ProfileSkeleton() {
  return (
    <div className='flex flex-col py-4'>
      <div className='flex flex-col gap-4 px-micro'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <Skeleton className='h-3 w-16 mb-1' />
            <Skeleton className='h-5 w-40' />
          </div>
        ))}
      </div>
      <div className='flex flex-col mt-6 gap-3'>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className='p-3 border-1 border-gray-100 rounded-5'>
            <Skeleton className='h-4 w-24 mb-2' />
            <Skeleton className='h-6 w-16' />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileSkeleton;
