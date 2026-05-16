'use client';

import DrawerIcon from '@/shared/assets/icons/drawer.svg';
import { usePathname } from 'next/navigation';
import LogoIcon from '@/shared/assets/icons/logo.svg';
import WhiteTitleIcon from '@/shared/assets/icons/white_title.svg';
import PrimaryTitleIcon from '@/shared/assets/icons/primary_title.svg';
import DirectoryIcon from '@/shared/assets/icons/directory.svg';
import BouquetIcon from '@/shared/assets/icons/bouquet.svg';
import PersonIcon from '@/shared/assets/icons/person.svg';
import { cn } from '@/shared/utils/styles';
import Image from 'next/image';
import { openModalAtom } from '@/shared/model/modal';
import { useSetAtom } from 'jotai';
import Sidebar, { TNavItem } from '../sidebar/sidebar';
import Link from 'next/link';
import { useUserAuth } from '@/hooks/use-supabase-user';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { BREAKPOINTS } from '@/shared/constants/breakpoints';

const PRIMARY_PATHS = ['/main', '/info'];
const WHITE_PATHS = ['/my-profile'];

type TVariant = 'primary' | 'default' | 'white';

const NAV_ITEMS: TNavItem[] = [
  { href: '/flower-directory', label: '꽃 사전', icon: <DirectoryIcon /> },
  { href: '/my-bouquet', label: '내 꽃다발', icon: <BouquetIcon />, isLoginRequired: true },
];

function Header() {
  const pathname = usePathname();
  const { isLogin, isLoading: isLoginLoading } = useUserAuth();
  const isTabletUp = useMediaQuery(`(min-width: ${BREAKPOINTS.TABLET})`);
  const isPcUp = useMediaQuery(`(min-width: ${BREAKPOINTS.PC})`);

  let variant: TVariant = 'default';
  if (WHITE_PATHS.includes(pathname)) {
    variant = 'white';
  } else if (PRIMARY_PATHS.includes(pathname)) {
    variant = 'primary';
  }

  const openModal = useSetAtom(openModalAtom);

  const authNavItem: TNavItem | null = isLoginLoading
    ? null
    : isLogin
      ? { href: '/my-profile', label: '내 프로필', icon: <PersonIcon /> }
      : { href: '/login', label: '로그인', icon: <PersonIcon /> };

  const navItems = authNavItem ? [...NAV_ITEMS, authNavItem] : NAV_ITEMS;

  const handleOpenSidebar = () => {
    openModal({
      id: 'sidebar',
      component: <Sidebar navItems={navItems} isLogin={isLogin} />,
      canCloseOnBackgroundClick: true,
      position: 'right',
    });
  };

  const handleClickLogo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/main') {
      e.preventDefault();
    }
  };

  return (
    <header
      className={cn(
        'relative w-full flex items-center z-header',
        'h-[48px] px-4 tablet:px-6 py-3',
        'pc:h-[72px] pc:px-8 pc:py-0 pc:gap-10',
        variant === 'white' ? 'bg-white' : '',
      )}
    >
      {variant === 'primary' && (
        <Image
          src={
            isPcUp
              ? '/images/bg_main_top_pc.webp'
              : isTabletUp
                ? '/images/bg_main_top_tablet.webp'
                : '/images/bg_main_top_mobile.webp'
          }
          alt='header-background'
          width={360}
          height={72}
          className='absolute z-[-1] left-0 top-0 w-full h-full object-cover object-top'
        />
      )}

      <Link href='/main' onClick={handleClickLogo} className='flex items-center'>
        <LogoIcon
          className={cn(
            'ml-[5px] mr-[7.8px] w-[21px] h-[21.8px]',
            variant === 'primary' ? 'fill-white' : 'fill-primary-600',
          )}
        />
        {variant === 'primary' ? <WhiteTitleIcon /> : <PrimaryTitleIcon />}
      </Link>

      {/* PC nav */}
      <nav className='hidden pc:flex items-start gap-7'>
        {navItems.map(({ href, label }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'text-body-xsm transition-colors',
                isActive ? 'text-primary-600 font-medium' : 'text-gray-400',
                variant === 'primary' ? 'text-white hover:text-primary-200' : 'text-primary-600 hover:text-primary-400',
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile/Tablet 드로어 버튼 */}
      <button
        type='button'
        aria-label='메뉴 열기'
        onClick={handleOpenSidebar}
        className='ml-auto pc:hidden'
      >
        <DrawerIcon
          className={cn(
            'w-[18px] h-[16px] mx-[3px]',
            variant === 'primary' ? 'fill-white stroke-white' : 'fill-primary-600 stroke-primary-600',
          )}
        />
      </button>
    </header>
  );
}

export default Header;
