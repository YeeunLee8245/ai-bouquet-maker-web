/* eslint-disable react-hooks/immutability */
import { ActionLabel } from '@/shared/ui/label';
import React, { useCallback, useEffectEvent, useLayoutEffect, useState } from 'react';
import XIcon from '@/shared/assets/icons/x.svg';
import { useSetAtom } from 'jotai';
import { IDirectoryEventHub, TDirectoryFilterItem } from '../_types';
import { directoryDefaultSelectedColors, directoryDefaultSelectedSeasons, DIRECTORY_SEASON_LIST } from '../_datas';
import { directoryColorsAtom, directorySeasonsAtom, resetDirectoryFiltersAtom } from '../_model/atoms';

type TProps = {
  eventHub: IDirectoryEventHub;
};

const seasonIds = new Set(DIRECTORY_SEASON_LIST.map(s => s.id as string));

function DirectoryFilterKeywordContainer({ eventHub }: TProps) {
  const [keywords, setKeywords] = useState<TDirectoryFilterItem[]>([...directoryDefaultSelectedColors, ...directoryDefaultSelectedSeasons]);
  const setColors = useSetAtom(directoryColorsAtom);
  const setSeasons = useSetAtom(directorySeasonsAtom);
  const resetFilters = useSetAtom(resetDirectoryFiltersAtom);

  const removeFromAtom = useCallback((id: string) => {
    if (seasonIds.has(id)) {
      setSeasons(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      setColors(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [setColors, setSeasons]);

  const handleClickRemoveKeyword = useCallback((id: string) => () => {
    setKeywords((prev) => prev.filter((k) => k.id !== id));
    removeFromAtom(id);
  }, [removeFromAtom]);

  const handleResetFilter = useCallback(() => {
    setKeywords([...directoryDefaultSelectedColors, ...directoryDefaultSelectedSeasons]);
    resetFilters();
    eventHub.onClickResetFilter?.();
  }, [eventHub, resetFilters]);

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
    <div className='flex items-start pt-3 justify-between'>
      <span className='flex items-center gap-2 flex-wrap'>
        {keywords.map(({ id, name }) => (
          <ActionLabel
            className='flex items-center text-ui-filter-sm'
            key={id}
            text={name}
            icon={
              <span onClick={handleClickRemoveKeyword(id)} className='cursor-pointer pl-micro pr-[3.2px]'>
                <XIcon className='w-[11px] h-[11px] fill-gray-200'/>
              </span>
            }
          />
        ))}
      </span>
      <button onClick={handleResetFilter} className='text-ui-textbtn-md text-gray-400 ml-2 mr-micro whitespace-nowrap'>초기화</button>
    </div>
  );
}

export default DirectoryFilterKeywordContainer;
