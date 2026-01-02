import { useEffect, useState } from 'react';
import { DIRECTORY_SEASON_LIST } from '../_datas';
import { IDirectoryEventHub } from '../_types';
import SeasonSwitchToggle from './SeasonSwitchToggle';

interface IProps {
  eventHub: IDirectoryEventHub;
  defaultSelectedSeasons?: string[];
}

function DirectorySeasonFilter({ eventHub, defaultSelectedSeasons = [] }: IProps) {
  // 선택된 계절 id
  const [selectedSeasons, setSelectedSeasons] = useState<Set<string>>(new Set(defaultSelectedSeasons));

  const clickSeasonFilter = (pressed: boolean) => (id: string) => {
    setSelectedSeasons((prev) => {
      const newSet = new Set(prev);
      if (pressed) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    eventHub.onClickSeasonFilter?.(Array.from(selectedSeasons));
  }, [eventHub, selectedSeasons]);

  return (
    <div className='flex items-center gap-2'>
      <span className='px-1 text-ui-label-md'>계절</span>
      <span className='ml-2 flex items-center justify-center gap-2 my-micro'>
        {DIRECTORY_SEASON_LIST.map(({ id, name }) => (
          <SeasonSwitchToggle
            key={id} name={name} pressed={selectedSeasons.has(id)}
            onPressedChange={(pressed: boolean) => () => {
              clickSeasonFilter(pressed)(id);
            } } />
        ))}
      </span>
    </div>
  );
}

export default DirectorySeasonFilter;
