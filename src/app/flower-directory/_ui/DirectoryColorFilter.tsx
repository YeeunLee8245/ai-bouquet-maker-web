import ColorSwitchToggle from '@/shared/ui/button/ColorSwitchToggle';
import { DIRECTORY_COLOR_LIST } from '../_datas';
import { useEffect, useState } from 'react';
import { IDirectoryEventHub } from '../_types';

interface IProps {
  eventHub: IDirectoryEventHub;
  defaultSelectedColors?: string[];
}

function DirectoryColorFilter({ eventHub, defaultSelectedColors = [] }: IProps) {
  // 선택된 색상 id 목록
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set(defaultSelectedColors));

  const clickColorFilter = (pressed: boolean) => (id: string) => {
    setSelectedColors((prev) => {
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
    eventHub.onClickColorFilter?.(Array.from(selectedColors));
  }, [eventHub, selectedColors]);

  return (
    <div className="flex items-center gap-2">
      <span className='px-1 text-ui-label-md'>색상</span>
      <span className='ml-2 flex items-center justify-center gap-2 my-micro'>
        {DIRECTORY_COLOR_LIST.map(({ id, colorHex }) => (
          <ColorSwitchToggle
            key={id}
            pressed={selectedColors.has(id)}
            onPressedChange={(pressed: boolean) => () => {
              clickColorFilter(pressed)(id);
            } }
            colorHex={colorHex}/>
        ))}
      </span>
    </div>
  );
}

export default DirectoryColorFilter;
