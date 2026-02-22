import { useRef, useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { DIRECTORY_SEASON_LIST, DIRECTORY_SEASON_NAME_MAP, TDirectorySeasonName } from '../_datas';
import { directorySeasonsAtom } from '../_model/atoms';
import { IDirectoryEventHub } from '../_types';
import SeasonSwitchToggle from './season-switch-toggle';
import { TooltipButton } from '@/shared/ui/button';

interface IProps {
  eventHub: IDirectoryEventHub;
}

function DirectorySeasonFilter({ eventHub }: IProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollContainerElement, setScrollContainerElement] = useState<HTMLElement | null>(null);
  const [selectedItems, setSelectedItems] = useAtom(directorySeasonsAtom);

  useEffect(() => {
    if (containerRef.current) {
      setScrollContainerElement(containerRef.current.closest('.overflow-y-scroll') as HTMLElement | null);
    }
  }, []);

  const handleItemChange = (id: string, pressed: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (pressed) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const clickSeasonFilter = (pressed: boolean) => (id: keyof typeof DIRECTORY_SEASON_NAME_MAP, name: TDirectorySeasonName) => {
    handleItemChange(id, pressed);
    eventHub.onClickSeasonFilter?.({ id, name }, pressed);
  };

  return (
    <div ref={containerRef} className='flex items-center gap-2'>
      <span className='px-1 text-ui-label-md whitespace-nowrap'>계절</span>
      <span className='flex items-center justify-center gap-2 my-micro'>
        {DIRECTORY_SEASON_LIST.map(({ id, name }) => (
          <SeasonSwitchToggle
            key={id} name={name} pressed={selectedItems.has(id)}
            onPressedChange={(pressed: boolean) => {
              clickSeasonFilter(pressed)(id, name);
            } } />
        ))}
      </span>
      {/* 가장 가까운 스크롤 컨테이너 요소 사용 */}
      <TooltipButton position='bottom-left' msg='초기 값은 현재 계절이에요.' scrollContainerElement={scrollContainerElement}/>
    </div>
  );
}

export default DirectorySeasonFilter;
