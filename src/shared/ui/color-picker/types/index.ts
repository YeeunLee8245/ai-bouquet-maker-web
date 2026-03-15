/**
 * onClick 함수 호출 시 색상 전달
 * @example onClick={(color) => { console.log(color); }}
 */
export interface IColorPickerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * @description 색상
   */
  color: string;
  variant?: 'primary' | 'additional';
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}
