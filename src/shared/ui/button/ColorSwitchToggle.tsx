import ToggleButton from './ToggleButton';
import { IToggleButtonProps } from './types';

interface IProps extends IToggleButtonProps {
  /**
   * @description 색상 16진수 값
   * @example #000000
   */
  colorHex: string;
}

function ColorSwitchToggle({ pressed, onPressedChange, className, colorHex, ...props }: IProps) {
  return (
    <ToggleButton
      pressed={pressed}
      size="sm"
      variant="custom"
      onPressedChange={onPressedChange}
      className={`w-8 h-8 rounded-full border-2 border-white ${className}`}
      style={{ backgroundColor: colorHex }}
      {...props}/>
  );
}

export default ColorSwitchToggle;
