import ColorSwitchToggle from '@/shared/ui/button/ColorSwitchToggle';
import { DIRECTORY_COLOR_LIST, DIRECTORY_COLOR_NAME_MAP, TDirectoryColorName } from '../_datas';
import { useState } from 'react';
import { IDirectoryEventHub } from '../_types';

interface IProps {
  eventHub: IDirectoryEventHub;
  defaultSelectedItems?: string[];
}

function DirectoryColorFilter({ eventHub, defaultSelectedItems = [] }: IProps) {
  // 선택된 색상 id 목록
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set(defaultSelectedItems));

  const clickColorFilter = (pressed: boolean) => (id: keyof typeof DIRECTORY_COLOR_NAME_MAP, name: TDirectoryColorName) => {
    setSelectedColors((prev) => {
      const newSet = new Set(prev);
      if (pressed) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
    eventHub.onClickColorFilter?.({ id, name }, pressed);
  };

  return (
    <div className="flex items-center gap-2">
      <span className='px-1 text-ui-label-md'>색상</span>
      <span className='ml-2 flex items-center justify-center gap-2 my-micro'>
        {DIRECTORY_COLOR_LIST.map(({ id, colorHex, name }) => (
          <ColorSwitchToggle
            key={id}
            pressed={selectedColors.has(id)}
            onPressedChange={(pressed: boolean) => {
              clickColorFilter(pressed)(id, name);
            } }
            colorHex={colorHex}/>
        ))}
      </span>
    </div>
  );
}

export default DirectoryColorFilter;
