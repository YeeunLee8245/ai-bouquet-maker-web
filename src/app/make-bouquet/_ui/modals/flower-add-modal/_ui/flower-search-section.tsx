import { SearchInput } from '@/shared/ui/input';
import React from 'react';
import { TEMP_FLOWER_SEARCH_RESULT } from '../_datas';
import { ColorChipGroup } from '@/shared/ui/chip';

function FlowerSearchSection() {
  return (
    <section>
      <SearchInput placeholder='꽃 이름, 꽃말, 설명 등으로 검색' className='w-full h-[40px]'/>
      {TEMP_FLOWER_SEARCH_RESULT.length > 0 && (
        <div className='mt-2 rounded-5 border-1 border-gray-100 min-h-[172px] max-h-[172px] overflow-y-scroll'>
          {TEMP_FLOWER_SEARCH_RESULT.map(({ id, name, colors }) => (
            <div key={id} className='px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors'>
              <div>
                <span className='text-body-lg'>{name.ko}</span>
                <span className='ml-2 text-body-md text-gray-400'>{name.en}</span>
              </div>
              <ColorChipGroup colors={colors} />
            </div>
          ))}
        </div>
      )}

    </section>
  );
}

export default FlowerSearchSection;
