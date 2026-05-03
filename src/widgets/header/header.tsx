'use client';

import DrawerIcon from '@/shared/assets/icons/drawer.svg';
import { usePathname } from 'next/navigation';
import LogoIcon from '@/shared/assets/icons/logo.svg';
import WhiteTitleIcon from '@/shared/assets/icons/white_title.svg';
import PrimaryTitleIcon from '@/shared/assets/icons/primary_title.svg';
import { cn } from '@/shared/utils/styles';
import Image from 'next/image';
import { openModalAtom } from '@/shared/model/modal';
import { useSetAtom } from 'jotai';
import Sidebar from '../sidebar/sidebar';
import Link from 'next/link';
import { useUserAuth } from '@/hooks/use-supabase-user';

interface IProps {
  variant?: 'primary' | 'default' | 'white';
}

const PRIMARY_PATHS = ['/main', '/info'];

const WHITE_PATHS = ['/my-profile'];

const NAV_ITEMS = [
  { href: '/flower-directory', label: '꽃 사전' },
  { href: '/my-bouquet', label: '내 꽃다발' },
];

function Header({ variant: variantProp = 'default' }: IProps) {
  const pathname = usePathname();
  const { isLogin, isLoading } = useUserAuth();

  let variant = variantProp;
  if (WHITE_PATHS.includes(pathname)) {
    variant = 'white';
  } else if (PRIMARY_PATHS.includes(pathname)) {
    variant = 'primary';
  }

  const openModal = useSetAtom(openModalAtom);

  const handleOpenSidebar = () => {
    openModal({
      id: 'sidebar',
      component: <Sidebar />,
      canCloseOnBackgroundClick: true,
      position: 'right',
    });
  };

  const handleClickLogo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/main') {
      e.preventDefault();
      return;
    }
  };

  const authNavItem = isLoading
    ? null
    : isLogin
      ? { href: '/my-profile', label: '내 프로필' }
      : { href: '/login', label: '로그인' };

  const navItems = authNavItem ? [...NAV_ITEMS, authNavItem] : NAV_ITEMS;

  return (
    <>
      {/* Mobile / Tablet header */}
      <header
        className={
          cn(
            'relative h-[48px] w-full px-4 tablet:px-6 py-3 flex justify-between items-center z-header pc:hidden',
            variant === 'white' ? 'bg-white' : '',
          )}
      >
        {/* 배경 이미지 */}
        {variant === 'primary' && (
          <Image
            src='/images/bg_main_top.webp'
            alt='header-background'
            width={360}
            height={48}
            className='absolute z-[-1] left-0 top-0 w-full h-[48px] object-cover object-top'
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
        <button type='button' aria-label='메뉴 열기' onClick={handleOpenSidebar}>
          <DrawerIcon className={cn('w-[18px] h-[16px] mx-[3px]', variant === 'primary' ? 'fill-white stroke-white' : 'fill-primary-600 stroke-primary-600')}/>
        </button>
      </header>

      {/* PC header */}
      <header className='hidden pc:flex h-[72px] w-full px-8 items-center gap-10 z-header'>
        {/* 배경 이미지 */}
        {variant === 'primary' && (
          <Image
            src='/images/bg_main_top.webp'
            alt='header-background'
            width={360}
            height={72}
            className='absolute z-[-1] left-0 top-0 w-full h-[72px] object-cover object-top'
          />
        )}
        <Link href='/main' onClick={handleClickLogo} className='flex items-center'>
          <LogoIcon className={cn('ml-[5px] mr-[7.8px] w-[21px] h-[21.8px]', variant === 'primary' ? 'fill-white' : 'fill-primary-600')} />
          {variant === 'primary' ? <WhiteTitleIcon /> : <PrimaryTitleIcon />}
        </Link>
        <nav className='flex items-start gap-7'>
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
      </header>
    </>
  );
}

export default Header;
