import { useAtom } from 'jotai';
import ColorSwitchToggle from '@/shared/ui/button/color-switch-toggle';
import { DIRECTORY_COLOR_LIST, DIRECTORY_COLOR_NAME_MAP, TDirectoryColorName } from '../_datas';
import { directoryColorsAtom } from '../_model/atoms';
import { IDirectoryEventHub } from '../_types';

interface IProps {
  eventHub: IDirectoryEventHub;
}

function DirectoryColorFilter({ eventHub }: IProps) {
  const [selectedItems, setSelectedItems] = useAtom(directoryColorsAtom);

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

  const clickColorFilter = (pressed: boolean) => (id: keyof typeof DIRECTORY_COLOR_NAME_MAP, name: TDirectoryColorName) => {
    handleItemChange(id, pressed);
    eventHub.onClickColorFilter?.({ id, name }, pressed);
  };

  return (
    <div className='flex items-center gap-2'>
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
