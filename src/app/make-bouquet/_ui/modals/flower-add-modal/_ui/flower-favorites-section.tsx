'use client';

import { TEMP_FLOWER_FAVORITE_LIST } from '../_datas';
import { Button } from '@/shared/ui/button';

type TProps = {
  selectedIds: string[];
  onToggle: (flower: { id: string; name: string }) => void;
};

function FlowerFavoritesSection({ selectedIds, onToggle }: TProps) {
  return (
    <section>
      <p className='text-title-md'>좋아하는 꽃</p>
      <div className='mt-3 flex flex-wrap gap-2'>
        {TEMP_FLOWER_FAVORITE_LIST.map(({id, name}) => {
          const isSelected = selectedIds.includes(id);
          return (
            <Button
              key={id}
              size='sm'
              data-state={isSelected ? 'selected' : 'default'}
              onClick={() => onToggle({ id, name })}
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
