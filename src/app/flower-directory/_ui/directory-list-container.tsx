import React, { useRef } from 'react';
import { useSetAtom } from 'jotai';
import { IDirectoryEventHub } from '../_types';
import { directoryDefaultSortOptions, testDirectoryItem } from '../_datas';
import { FlowerCard } from '@/entities/flower/ui';
import { Button } from '@/shared/ui/button';
import { toggleFlowerAtom } from '@/shared/model/selected-flowers';

type TProps = {
  eventHub: IDirectoryEventHub;
};

function DirectoryListContainer({ eventHub }: TProps) {
  const sortBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const toggleFlower = useSetAtom(toggleFlowerAtom);

  const handleClickSort = (idx: number) => () => {
    sortBtnRefs.current.forEach((ref, index) => {
      if (!ref) {return;}
      ref.setAttribute('aria-current', index === idx ? 'true' : 'false');
    });
  };

  return (
    <div className='flex flex-col border-t-2 border-gray-100 mt-4'>
      <div className='flex items-center justify-between pt-4'>
        <span className='text-ui-label-sm text-gray-400 pl-micro'>{'n'}개의 꽃</span>
        <span className='pr-micro flex items-center gap-1'>
          {directoryDefaultSortOptions.map(({ id, name }, index) => (
            <button
              ref={ref => {
                sortBtnRefs.current[index] = ref;
              }}
              onClick={handleClickSort(index)}
              key={id}
              aria-current={index === 0 ? 'true' : 'false'}
              className='text-ui-textbtn-sm text-gray-400 aria-current:text-gray-700'
            >
              {name}
            </button>
          ))}
        </span>
      </div>
      <div className='grid grid-cols-2 gap-x-4 gap-y-8 mt-3'>
        {Array.from({ length: 10 }).map((_, index) => (
          <FlowerCard
            key={index}
            size='lg'
            {...{...testDirectoryItem, id: `${index}`, name: `${testDirectoryItem.name} ${index}`}}
            actionButton={<Button size='md' onClick={() => toggleFlower({ id: `${index}`, name: `${testDirectoryItem.name} ${index}` })} className='mt-3'>선택하기</Button>}/>
        ))}
      </div>
    </div>
  );
}

export default DirectoryListContainer;
