export interface IColorPickerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  /**
   * @description 색상
   */
  color: string;
  /**
   * @description 색상 선택 함수
   */
  onSelect: (color: string) => void;
}
