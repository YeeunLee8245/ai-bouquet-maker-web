/**
 * onSelect 함수 호출 시 색상 전달
 * @example onSelect={(color) => { console.log(color); }}
 */
export interface IColorPickerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  /**
   * @description 색상
   */
  color: string;
  variant?: 'primary' | 'additional';
  /**
   * @description 색상 선택 함수
   */
  onSelect: (color: string) => void;
  children?: React.ReactNode;
}
