import { DIRECTORY_COLOR_LIST, DIRECTORY_SEASON_LIST } from '../_datas';
import { IDirectoryEventHub } from '../_types';
import DirectoryColorFilter from './DirectoryColorFilter';
import DirectorySeasonFilter from './DirectorySeasonFilter';

type TProps = {
  eventHub: IDirectoryEventHub;
};

function DirectoryFilterContainer({ eventHub }: TProps) {
  return (
    <div>
      <DirectoryColorFilter eventHub={eventHub} defaultSelectedColors={[DIRECTORY_COLOR_LIST[0].id]} />
      <DirectorySeasonFilter eventHub={eventHub} defaultSelectedSeasons={[DIRECTORY_SEASON_LIST[0].id]} />
    </div>
  );
}

export default DirectoryFilterContainer;
