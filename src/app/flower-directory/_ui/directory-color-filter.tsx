import ColorSwitchToggle from '@/shared/ui/button/color-switch-toggle';
import { DIRECTORY_COLOR_LIST, DIRECTORY_COLOR_NAME_MAP, TDirectoryColorName } from '../_datas';
import { IDirectoryEventHub } from '../_types';

interface IProps {
  eventHub: IDirectoryEventHub;
  selectedItems: Set<string>;
  onItemChange: (id: string, pressed: boolean) => void;
}

function DirectoryColorFilter({ eventHub, selectedItems, onItemChange }: IProps) {
  const clickColorFilter = (pressed: boolean) => (id: keyof typeof DIRECTORY_COLOR_NAME_MAP, name: TDirectoryColorName) => {
    onItemChange(id, pressed);
    eventHub.onClickColorFilter?.({ id, name }, pressed);
  };

  return (
    <div className="flex items-center gap-2">
      <span className='px-1 text-ui-label-md whitespace-nowrap'>색상</span>
      <span className='flex items-center justify-center gap-2 my-micro'>
        {DIRECTORY_COLOR_LIST.map(({ id, colorHex, name }) => (
          <ColorSwitchToggle
            key={id}
            pressed={selectedItems.has(id)}
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
