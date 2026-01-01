import DrawerIcon from '@/shared/assets/icons/drawer.svg';

function Header() {
  return (
    <header className="w-full px-[16px] py-[12px] flex justify-between items-center">
      <span className="text-[17px] font-medium tracking-[-0.34px]">꽃다발 레시피</span>
      <div className="cursor-pointer">
        <DrawerIcon />
      </div>
    </header>
  );
}

export default Header;
