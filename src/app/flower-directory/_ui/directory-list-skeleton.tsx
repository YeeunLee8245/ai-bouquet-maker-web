import FlowerCardSkeleton from '@/shared/ui/skeleton/flower-card-skeleton';

function DirectoryListSkeleton() {
  return (
    <div className='grid grid-cols-2 tablet:grid-cols-4 gap-x-4 pc:gap-x-5 gap-y-8 tablet:gap-y-10 mt-3'>
      {Array.from({ length: 6 }).map((_, i) => (
        <FlowerCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default DirectoryListSkeleton;
