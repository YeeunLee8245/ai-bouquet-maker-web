export interface IDirectoryEventHub {
  onToggleFilterSection?: (pressed: boolean) => void;
  onClickColorFilter?: (id: string) => void;
  onClickSeasonFilter?: (id: string) => void;

}
