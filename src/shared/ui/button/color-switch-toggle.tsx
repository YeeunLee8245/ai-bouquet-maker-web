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
      size="sm"
      variant="custom"
      onPressedChange={onPressedChange}
      className={cn('relative w-8 h-8 rounded-full border-2 border-gray-100',
        'hover:border-white hover:after:content-[""] hover:after:absolute hover:after:inset-0 hover:after:bg-black/40 hover:after:rounded-full ',
        'data-[state="on"]:border-white data-[state="on"]:after:content-[""] data-[state="on"]:after:absolute data-[state="on"]:after:inset-0 data-[state="on"]:after:bg-black/40 data-[state="on"]:after:rounded-full',
        className,
      )}
      style={{ backgroundColor: colorHex }}
      {...props}>
      {pressed && <div
        className='w-[33px] h-[33px] rounded-full bg-black/40 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 absolute -z-1'
      />}
    </ToggleButton>
  );
}

export default ColorSwitchToggle;
