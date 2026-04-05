import { useAtom } from 'jotai';
import { DIRECTORY_SEASON_LIST, DIRECTORY_SEASON_NAME_MAP, TDirectorySeasonName } from '../_datas';
import { directorySeasonsAtom } from '../_model/atoms';
import { IDirectoryEventHub } from '../_types';
import SeasonSwitchToggle from './season-switch-toggle';

interface IProps {
  eventHub: IDirectoryEventHub;
}

function DirectorySeasonFilter({ eventHub }: IProps) {
  const [selectedItems, setSelectedItems] = useAtom(directorySeasonsAtom);

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
    <div className='flex items-center gap-2'>
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
    </div>
  );
}

export default DirectorySeasonFilter;
