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
interface IProps {
  variant?: 'primary' | 'default';
}

function Header({ variant: variantProp }: IProps) {
  const pathname = usePathname();
  const variant = variantProp ?? (pathname === '/main' ? 'primary' : 'default');
  const openModal = useSetAtom(openModalAtom);

  const handleOpenSidebar = () => {
    openModal({
      id: 'sidebar',
      component: <Sidebar />,
      position: 'right',
    });
  };

  const handleClickLogo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/main') {
      e.preventDefault();
      return;
    }
  };

  return (
    <header className='relative h-[48px] w-full px-4 py-3 flex justify-between items-center z-header'>
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
        <LogoIcon className={cn('ml-[5px] mr-[7.8px] w-[21px] h-[21.8px]', variant === 'primary' ? 'fill-white' : 'fill-primary-600')} />
        {variant === 'primary' ? <WhiteTitleIcon /> : <PrimaryTitleIcon />}
      </Link>
      <button type='button' onClick={handleOpenSidebar}>
        <DrawerIcon className={cn('w-[18px] h-[16px] mx-[3px]', variant === 'primary' ? 'fill-white stroke-white' : 'fill-primary-600 stroke-primary-600')}/>
      </button>
    </header>
  );
}

export default Header;
