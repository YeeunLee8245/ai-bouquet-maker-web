import { useRef, useEffect, useMemo } from 'react';
import { useSetAtom, useAtom, useAtomValue, useStore } from 'jotai';
import { IDirectoryEventHub } from '../_types';
import { directoryDefaultSortOptions } from '../_datas';
import { directorySortAtom } from '../_model/atoms';
import { useDirectoryQuery } from '../_model/use-directory-query';
import { FlowerCard } from '@/entities/flower/ui';
import { Button } from '@/shared/ui/button';
import { toggleFlowerAtom, selectedFlowersAtom } from '@/shared/model/selected-flowers';
import LikeButton from '@/features/like/ui/like-button';
import { initLikeFromServer } from '@/features/like/model/atoms';
import { cn } from '@/shared/utils/styles';

type TProps = {
  eventHub: IDirectoryEventHub;
};

function DirectoryListContainer({ eventHub }: TProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const store = useStore();
  const toggleFlower = useSetAtom(toggleFlowerAtom);
  const selectedFlowers = useAtomValue(selectedFlowersAtom);
  const [sort, setSort] = useAtom(directorySortAtom);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useDirectoryQuery();

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {return;}

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const [flowers, total] = useMemo(() => {
    return [data?.pages.flatMap(page => page.flowers) ?? [], data?.pages[0]?.total ?? 0];
  }, [data]);

  useEffect(() => {
    flowers.forEach((flower) => {
      if (flower.isLiked !== undefined) {
        initLikeFromServer({ store, liked: flower.isLiked, id: flower.id, type: 'flower' });
      }
    });
  }, [flowers, store]);

  return (
    <div className='flex flex-col border-t-2 border-gray-100 mt-4'>
      <div className='flex items-center justify-between pt-4'>
        <span className='text-ui-label-sm text-gray-400 pl-micro'>{total}개의 꽃</span>
        <span className='pr-micro flex items-center gap-1'>
          {directoryDefaultSortOptions.map(({ id, name }) => (
            <button
              onClick={() => setSort(id)}
              key={id}
              aria-current={id === sort ? 'true' : 'false'}
              className='text-ui-textbtn-sm text-gray-400 aria-current:text-gray-700'
            >
              {name}
            </button>
          ))}
        </span>
      </div>
      <div className='grid grid-cols-2 gap-x-4 gap-y-8 mt-3'>
        {isLoading && (
          <span className='col-span-2 text-center py-8 text-ui-label-sm text-gray-400'>
            불러오는 중...
          </span>
        )}
        {flowers.map((flower) => (
          <FlowerCard
            key={flower.id}
            size='lg'
            id={flower.id}
            imageUrl={flower.imageUrl}
            name={flower.name}
            colors={flower.colors}
            tags={flower.tags}
            likeButton={flower.isLiked !== undefined
              ? <LikeButton type='flower' id={flower.id} variant='outline' size='lg' />
              : undefined
            }
            actionButton={
              (() => {
                const isSelected = selectedFlowers.some(f => f.id === flower.id);
                return (
                  <Button
                    size='md'
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFlower({ id: flower.id, name: flower.name });
                    }}
                    className={cn('mt-3', isSelected && 'bg-primary-600 text-primary-200')}
                  >
                    {isSelected ? '선택 취소' : '선택하기'}
                  </Button>
                );
              })()
            }
          />
        ))}
      </div>
      <div ref={sentinelRef} className='h-1' />
      {isFetchingNextPage && (
        <div className='flex justify-center py-4'>
          <span className='text-ui-label-sm text-gray-400'>불러오는 중...</span>
        </div>
      )}
    </div>
  );
}

export default DirectoryListContainer;
