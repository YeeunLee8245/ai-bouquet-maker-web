import Skeleton from '@/shared/ui/skeleton/skeleton';

function FlowerDetailSkeleton() {
  return (
    <div className='relative flex-1 overflow-y-auto hide-scrollbar'>
      <div className='tablet:flex tablet:flex-row tablet:items-start tablet:gap-6 pc:gap-8 tablet:px-6 pc:px-8 tablet:pt-6 pc:pt-8'>
        {/* 이미지 영역 */}
        <Skeleton className='w-full aspect-square tablet:w-[440px] tablet:h-[440px] pc:w-[512px] pc:h-[512px] tablet:shrink-0 rounded-none tablet:rounded-3' />
        {/* 제목 + 설명 */}
        <div className='p-4 tablet:px-0 tablet:py-0 tablet:flex-1 flex flex-col gap-3'>
          <Skeleton className='h-7 w-32' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
        </div>
      </div>
      {/* 탭 헤더 */}
      <div className='flex gap-4 px-4 tablet:px-6 pc:px-8 border-b border-gray-100'>
        <Skeleton className='h-9 w-16 rounded-none' />
        <Skeleton className='h-9 w-16 rounded-none' />
      </div>
      {/* 탭 콘텐츠 */}
      <div className='p-4 tablet:px-6 pc:px-8 flex flex-col gap-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-4 w-full' />
        ))}
      </div>
    </div>
  );
}

export default FlowerDetailSkeleton;
