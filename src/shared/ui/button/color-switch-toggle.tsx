import { cn } from '@/shared/utils/styles';
import ToggleButton from './toggle-button';
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
      size='sm'
      variant='custom'
      onPressedChange={onPressedChange}
      className={cn('color-circle-toggle', className)}
      style={{ backgroundColor: colorHex }}
      {...props}>
      {pressed && <div
        className='w-[33px] h-[33px] rounded-full bg-black/40 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 absolute -z-1'
      />}
    </ToggleButton>
  );
}

export default ColorSwitchToggle;
