import { IDirectoryEventHub } from '../_types';
import DirectoryColorFilter from './DirectoryColorFilter';

type TProps = {
  eventHub: IDirectoryEventHub;
};

function DirectoryFilterContainer({ eventHub }: TProps) {
  return (
    <div>
      <DirectoryColorFilter />
    </div>
  );
}

export default DirectoryFilterContainer;
