import { directoryDefaultSelectedColors, directoryDefaultSelectedSeasons } from '../_datas';
import { IDirectoryEventHub } from '../_types';
import DirectoryColorFilter from './DirectoryColorFilter';
import DirectorySeasonFilter from './DirectorySeasonFilter';

type TProps = {
  eventHub: IDirectoryEventHub;
};

function DirectoryFilterContainer({ eventHub }: TProps) {
  return (
    <div className='flex flex-col gap-2'>
      <DirectoryColorFilter eventHub={eventHub} defaultSelectedItems={directoryDefaultSelectedColors.map(({ id }) => id)} />
      {/* TODO: yeeun 필터 선택 초기값 수정 */}
      <DirectorySeasonFilter eventHub={eventHub} defaultSelectedItems={directoryDefaultSelectedSeasons.map(({ id }) => id)} />
    </div>
  );
}

export default DirectoryFilterContainer;
