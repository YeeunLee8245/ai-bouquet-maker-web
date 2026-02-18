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

export type TDirectoryFlower = {
  id: string;
  imageUrl: string;
  name: string;
  isLiked?: boolean;
  colors: string[];
  tags: string[];
};

export type TDirectoryResponse = {
  success: boolean;
  data: {
    default_season: string;
    flowers: TDirectoryFlower[];
    total: number;
    page: number;
    limit: number;
    has_next_page: boolean;
  };
};
