import Skeleton from '@/shared/ui/skeleton/skeleton';

function FlowerDetailSkeleton() {
  return (
    <div className='relative flex-1 overflow-y-auto hide-scrollbar'>
      {/* 이미지 영역 */}
      <Skeleton className='w-full h-[280px] rounded-none' />
      {/* 제목 + 설명 */}
      <div className='p-4 flex flex-col gap-3'>
        <Skeleton className='h-7 w-32' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
      </div>
      {/* 탭 헤더 */}
      <div className='flex gap-4 px-4 border-b border-gray-100'>
        <Skeleton className='h-9 w-16 rounded-none' />
        <Skeleton className='h-9 w-16 rounded-none' />
      </div>
      {/* 탭 콘텐츠 */}
      <div className='p-4 flex flex-col gap-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-4 w-full' />
        ))}
      </div>
    </div>
  );
}

export default FlowerDetailSkeleton;
