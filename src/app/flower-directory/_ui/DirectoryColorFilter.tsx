import ColorSwitchToggle from '@/shared/ui/button/ColorSwitchToggle';

function DirectoryColorFilter() {
  return (
    <div className="flex items-center gap-2">
      <span>색상</span>
      <span>
        <ColorSwitchToggle
          pressed={false}
          onPressedChange={(pressed: boolean) => () => { } }
          className=""
          colorHex="#FF8E3E"/>
      </span>
    </div>
  );
}

export default DirectoryColorFilter;
