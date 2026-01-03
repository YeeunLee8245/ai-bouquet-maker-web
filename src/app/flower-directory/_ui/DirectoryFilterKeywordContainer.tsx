/* eslint-disable react-hooks/immutability */
import { ActionLabel } from '@/shared/ui/label';
import React, { useCallback, useEffectEvent, useLayoutEffect, useState } from 'react';
import XIcon from '@/shared/assets/icons/x.svg';
import { IDirectoryEventHub, TDirectoryFilterItem } from '../_types';
import { directoryDefaultSelectedColors, directoryDefaultSelectedSeasons } from '../_datas';

type TProps = {
  eventHub: IDirectoryEventHub;
};

function DirectoryFilterKeywordContainer({ eventHub }: TProps) {
  const [keywords, setKeywords] = useState<TDirectoryFilterItem[]>([...directoryDefaultSelectedColors, ...directoryDefaultSelectedSeasons]);

  const handleClickRemoveKeyword = useCallback((id: string) => () => {
    setKeywords((prev) => prev.filter((k) => k.id !== id));
  }, []);

  const setEventHubFilters = useEffectEvent(() => {
    eventHub.onClickColorFilter = (selectedColor: TDirectoryFilterItem, pressed: boolean) => {
      if (!pressed) {
        handleClickRemoveKeyword(selectedColor.id)();
        return;
      }
      setKeywords((prev) => [...prev, selectedColor]);
    };

    eventHub.onClickSeasonFilter = (selectedSeason: TDirectoryFilterItem, pressed: boolean) => {
      if (!pressed) {
        handleClickRemoveKeyword(selectedSeason.id)();
        return;
      }
      setKeywords((prev) => [...prev, selectedSeason]);
    };
  });

  useLayoutEffect(() => {
    setEventHubFilters();
  }, []);

  return (
    <div className='flex items-center gap-2'>
      {keywords.map(({ id, name }) => (
        <ActionLabel
          className='flex items-center text-ui-filter-sm'
          key={id}
          text={name}
          icon={
            <span onClick={handleClickRemoveKeyword(id)} className='cursor-pointer pl-micro pr-[3.2px]'>
              <XIcon />
            </span>
          }
        />
      ))}
    </div>
  );
}

export default DirectoryFilterKeywordContainer;
