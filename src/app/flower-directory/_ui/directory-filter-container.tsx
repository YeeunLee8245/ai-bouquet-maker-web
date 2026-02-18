/* eslint-disable react-hooks/immutability */
import { useEffectEvent, useLayoutEffect, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { directoryColorsAtom, directorySeasonsAtom, resetDirectoryFiltersAtom } from '../_model/atoms';
import { IDirectoryEventHub } from '../_types';
import DirectoryColorFilter from './directory-color-filter';
import DirectorySeasonFilter from './directory-season-filter';

type TProps = {
  eventHub: IDirectoryEventHub;
};

function DirectoryFilterContainer({ eventHub }: TProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColors, setSelectedColors] = useAtom(directoryColorsAtom);
  const [selectedSeasons, setSelectedSeasons] = useAtom(directorySeasonsAtom);
  const resetFilters = useSetAtom(resetDirectoryFiltersAtom);

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
    eventHub.onToggleFilterSection = (pressed: boolean) => {
      if (!containerRef.current) {return;}

      const container = containerRef.current as HTMLDivElement;
      container.style.gridTemplateRows = pressed ? '1fr' : '0fr';
      const filterSection = container.querySelector<HTMLDivElement>('[data-filter-section]');
      if (!filterSection) {return;}

      filterSection.style.cssText = pressed ?
        'overflow: auto;' :
        'overflow: hidden;';
    };
    eventHub.onClickResetFilter = () => {
      resetFilters();
    };
  });

  useLayoutEffect(() => {
    setEventHubFilters();
  }, []);

  return (
    <div
      ref={containerRef}
      className='grid transition-[grid-template-rows] duration-300 ease-in-out'
      style={{ gridTemplateRows: '0fr' }}
    >
      <div data-filter-section className='min-h-0 overflow-hidden'>
        <div className='flex flex-col gap-2 pb-4'>
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
      </div>
    </div>
  );
}

export default DirectoryFilterContainer;
