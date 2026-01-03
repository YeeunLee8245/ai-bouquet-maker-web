import { useState } from 'react';
import { DIRECTORY_SEASON_LIST, DIRECTORY_SEASON_NAME_MAP, TDirectorySeasonName } from '../_datas';
import { IDirectoryEventHub } from '../_types';
import SeasonSwitchToggle from './SeasonSwitchToggle';
import { TooltipButton } from '@/shared/ui/button';

interface IProps {
  eventHub: IDirectoryEventHub;
  defaultSelectedItems?: string[];
}

function DirectorySeasonFilter({ eventHub, defaultSelectedItems = [] }: IProps) {
  // 선택된 계절 id
  const [selectedSeasons, setSelectedSeasons] = useState<Set<string>>(new Set(defaultSelectedItems));

  const clickSeasonFilter = (pressed: boolean) => (id: keyof typeof DIRECTORY_SEASON_NAME_MAP, name: TDirectorySeasonName) => {
    setSelectedSeasons((prev) => {
      const newSet = new Set(prev);
      if (pressed) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
    eventHub.onClickSeasonFilter?.({ id, name }, pressed);
  };

  return (
    <div className='flex items-center gap-2'>
      <span className='px-1 text-ui-label-md'>계절</span>
      <span className='ml-2 flex items-center justify-center gap-2 my-micro'>
        {DIRECTORY_SEASON_LIST.map(({ id, name }) => (
          <SeasonSwitchToggle
            key={id} name={name} pressed={selectedSeasons.has(id)}
            onPressedChange={(pressed: boolean) => {
              clickSeasonFilter(pressed)(id, name);
            } } />
        ))}
      </span>
      <TooltipButton position='bottom-left' msg='초기 값은 현재 계절이에요.'/>
    </div>
  );
}

export default DirectorySeasonFilter;
