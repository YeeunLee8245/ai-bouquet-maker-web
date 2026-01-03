import { DIRECTORY_COLOR_NAME_MAP, DIRECTORY_SEASON_NAME_MAP, TDirectoryColorName, TDirectorySeasonName } from '../_datas';

export type TDirectoryFilterItem = {
  id: keyof typeof DIRECTORY_COLOR_NAME_MAP | keyof typeof DIRECTORY_SEASON_NAME_MAP;
  name: TDirectoryColorName | TDirectorySeasonName;
};

export interface IDirectoryEventHub {
  onToggleFilterSection?: (pressed: boolean) => void;
  onClickColorFilter?: (selectedColor: TDirectoryFilterItem, pressed: boolean) => void;
  onClickSeasonFilter?: (selectedSeason: TDirectoryFilterItem, pressed: boolean) => void;
  onClickResetFilter?: VoidFunction;
  onSearchKeyword?: (keyword: string) => void;
}
