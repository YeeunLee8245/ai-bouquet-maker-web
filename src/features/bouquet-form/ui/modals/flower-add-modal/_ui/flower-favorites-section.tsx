'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { fetchLikedFlowers, TLikedFlower } from '@api/my.api';

type TProps = {
  selectedIds: string[];
  onToggle: (flower: { id: string; name: string }) => void;
};

function FlowerFavoritesSection({ selectedIds, onToggle }: TProps) {
  const [likedFlowers, setLikedFlowers] = useState<TLikedFlower[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLikedFlowers()
      .then(setLikedFlowers)
      .catch(() => {
        // API 실패 시 빈 목록 유지
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section>
        <p className='text-title-md'>좋아하는 꽃</p>
        <p className='mt-3 text-body-md text-gray-400'>불러오는 중...</p>
      </section>
    );
  }

  if (likedFlowers.length === 0) {
    return (
      <section>
        <p className='text-title-md'>좋아하는 꽃</p>
        <p className='mt-3 text-body-md text-gray-400'>좋아요한 꽃이 없습니다.</p>
      </section>
    );
  }

  return (
    <section>
      <p className='text-title-md'>좋아하는 꽃</p>
      <div className='mt-3 flex flex-wrap gap-2'>
        {likedFlowers.map(({ flower_id: id, name_ko: name }) => {
          const isSelected = selectedIds.includes(id);
          return (
            <Button
              key={id}
              size='sm'
              data-state={isSelected ? 'selected' : 'default'}
              onClick={() => onToggle({ id, name })}
              className='flex-shrink-0'
            >
              {name}
            </Button>
          );
        })}
      </div>
    </section>
  );
}

export default FlowerFavoritesSection;
