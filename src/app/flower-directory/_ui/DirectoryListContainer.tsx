import React, { useRef } from 'react';
import { IDirectoryEventHub } from '../_types';
import { directoryDefaultSortOptions, testDirectoryList } from '../_datas';

type TProps = {
  eventHub: IDirectoryEventHub;
};

function DirectoryListContainer({ eventHub }: TProps) {
  const sortBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
      <div>
        {testDirectoryList.map(({ id, name, color, season, tags }) => (
          <div key={id}>
            <span>{name}</span>
            <span>{color}</span>
            <span>{season}</span>
            <span>{tags.join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DirectoryListContainer;
