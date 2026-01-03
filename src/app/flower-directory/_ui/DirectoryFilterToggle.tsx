import { ToggleButton } from '@/shared/ui/button';
import { IDirectoryEventHub } from '../_types';
import { useState } from 'react';

type TProps = {
  eventHub: IDirectoryEventHub;
};

function DirectoryFilterToggle({ eventHub }: TProps) {
  const [pressed, setPressed] = useState(false);

  const onPressedChange = (pressed: boolean) => {
    setPressed(pressed);
    eventHub.onToggleFilterSection?.(pressed);
  };

  return (
    <ToggleButton size="sm" pressed={pressed} onPressedChange={onPressedChange}>
      필터
    </ToggleButton>
  );
}

export default DirectoryFilterToggle;
