import DrawerIcon from '@/shared/assets/icons/drawer.svg';

function Header() {
  return (
    <header className="h-[48px] w-full px-4 py-3 flex justify-between items-center">
      <span className="text-[17px] leading-[20px] font-medium tracking-[-0.34px]">꽃다발 레시피</span>
      <div className="cursor-pointer">
        <DrawerIcon />
      </div>
    </header>
  );
}

export default Header;
