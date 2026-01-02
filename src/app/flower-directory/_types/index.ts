export interface IDirectoryEventHub {
  onToggleFilterSection?: (pressed: boolean) => void;
  onClickColorFilter?: (selectedColors: string[]) => void;
  onClickSeasonFilter?: (selectedSeasons: string[]) => void;

}
