import { ToggleButton } from '@/shared/ui/button';
import { IToggleButtonProps } from '@/shared/ui/button/types';

export interface IProps extends IToggleButtonProps {
  name: string;
}

function SeasonSwitchToggle({name, ...props }: IProps) {
  return (
    <ToggleButton
      variant='custom'
      className='py-1 px-2 text-ui-filter-sm bg-gray-100 rounded-6
      hover:bg-primary-400 hover:text-white
      data-[state="on"]:bg-primary-400 data-[state="on"]:text-white'
      {...props}>
      {name}
    </ToggleButton>
  );
}

export default SeasonSwitchToggle;
