import ColorSwitchToggle from '@/shared/ui/button/ColorSwitchToggle';
import { DIRECTORY_COLOR_LIST } from '../_datas';
import { useState } from 'react';

interface IProps {
  defaultSelectedColors: string[];
}

function DirectoryColorFilter({ defaultSelectedColors = [] }: IProps) {
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

  return (
    <div className="flex items-center gap-2">
      <span className='text-ui-label-md'>색상</span>
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
