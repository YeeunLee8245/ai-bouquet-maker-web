/* eslint-disable react-hooks/immutability */
import { useEffectEvent, useLayoutEffect, useState } from 'react';
import { directoryDefaultSelectedColors, directoryDefaultSelectedSeasons } from '../_datas';
import { IDirectoryEventHub } from '../_types';
import DirectoryColorFilter from './DirectoryColorFilter';
import DirectorySeasonFilter from './DirectorySeasonFilter';

type TProps = {
  eventHub: IDirectoryEventHub;
};

function DirectoryFilterContainer({ eventHub }: TProps) {
  const [selectedColors, setSelectedColors] = useState<Set<string>>(
    new Set(directoryDefaultSelectedColors.map(({ id }) => id)),
  );
  const [selectedSeasons, setSelectedSeasons] = useState<Set<string>>(
    new Set(directoryDefaultSelectedSeasons.map(({ id }) => id)),
  );

  const handleColorChange = (id: string, pressed: boolean) => {
    setSelectedColors(prev => {
      const newSet = new Set(prev);
      if (pressed) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSeasonChange = (id: string, pressed: boolean) => {
    setSelectedSeasons(prev => {
      const newSet = new Set(prev);
      if (pressed) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const setEventHubFilters = useEffectEvent(() => {
    eventHub.onClickResetFilter = () => {
      setSelectedColors(new Set(directoryDefaultSelectedColors.map(({ id }) => id)));
      setSelectedSeasons(new Set(directoryDefaultSelectedSeasons.map(({ id }) => id)));
    };
  });

  useLayoutEffect(() => {
    setEventHubFilters();
  }, []);

  return (
    <div className='flex flex-col gap-2'>
      <DirectoryColorFilter
        eventHub={eventHub}
        selectedItems={selectedColors}
        onItemChange={handleColorChange}
      />
      {/* TODO: yeeun 필터 선택 초기값 수정 */}
      <DirectorySeasonFilter
        eventHub={eventHub}
        selectedItems={selectedSeasons}
        onItemChange={handleSeasonChange}
      />
    </div>
  );
}

export default DirectoryFilterContainer;
