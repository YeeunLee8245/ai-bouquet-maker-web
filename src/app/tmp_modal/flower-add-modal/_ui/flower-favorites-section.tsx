import React from 'react';
import { TEMP_FLOWER_FAVORITE_LIST } from '../_datas';
import { Button } from '@/shared/ui/button';

function FlowerFavoritesSection() {
  return (
    <section>
      <p className='text-title-md'>좋아하는 꽃</p>
      <div className='mt-3 flex flex-wrap gap-2'>
        {TEMP_FLOWER_FAVORITE_LIST.map(({id, name}) => (
          <Button
            key={id}
            size='sm'
          >
            {name}
          </Button>
        ))}
      </div>
    </section>
  );
}

export default FlowerFavoritesSection;
