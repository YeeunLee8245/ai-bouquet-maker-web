'use client';

import React, { cloneElement } from 'react';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { useSetAtom } from 'jotai';
import UpArrowIcon from '@/shared/assets/icons/up_arrow.svg';
import PersonIcon from '@/shared/assets/icons/person.svg';
import DirectoryIcon from '@/shared/assets/icons/directory.svg';
import BouquetIcon from '@/shared/assets/icons/bouquet.svg';
import Link from 'next/link';
import { cn } from '@/shared/utils/styles';
import { usePathname, useRouter } from 'next/navigation';
import { useUserAuth } from '@/hooks/use-supabase-user';
import { showToastAtom } from '@/shared/model/toast/toast.actions';

const SIDEBAR_ITEMS = [
  {
    path: '/flower-directory',
    icon: <DirectoryIcon />,
    label: '꽃 사전',
  },
  {
    path: '/my-bouquet',
    icon: <BouquetIcon />,
    label: '내 꽃다발',
  },
];

const AUTHENTICATED_ITEMS = [
  {
    path: '/my-profile',
    icon: <PersonIcon />,
    label: '내 프로필',
  },
];

const UNAUTHENTICATED_ITEMS = [
  {
    path: '/login',
    icon: <PersonIcon />,
    label: '로그인',
  },
];

function Sidebar({ modalId }: TModalProps) {
  const closeModal = useSetAtom(closeModalAtom);
  const showToast = useSetAtom(showToastAtom);
  const router = useRouter();
  const pathname = usePathname();
  const { isLogin } = useUserAuth();

  const menuItems = isLogin ? [...SIDEBAR_ITEMS, ...AUTHENTICATED_ITEMS] : [...SIDEBAR_ITEMS, ...UNAUTHENTICATED_ITEMS];

  const handleClickMenuItem = (path: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === path) {
      e.preventDefault();
      return;
    }
    if (!isLogin && path === '/my-bouquet') {
      e.preventDefault();
      showToast({ message: '로그인이 필요합니다.' });
      router.push('/login');
    }
    closeModal(modalId);
  };

  return (
    <div
      className='w-[268px] h-[100dvh] bg-primary-400 animate-slide-in-from-right px-7 py-11 flex flex-col'
    >
      {/* 닫기 버튼 */}
      <button
        type='button'
        onClick={() => closeModal(modalId)}
        className='w-fit text-white'
      >
        <UpArrowIcon className='w-[18px] m-[3px] fill-white transform rotate-[-90deg]'/>
      </button>
      {/* 상단 메뉴 */}
      <div className='mt-10 flex flex-col justify-start gap-4'>
        { menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={handleClickMenuItem(item.path)}
            className={
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-5 transition-colors hover:bg-primary-300 active:bg-primary-500',
                pathname === item.path ? 'bg-primary-300' : '',
              )}
          >
            {cloneElement(item.icon, { className: 'w-[20px] h-[20px] fill-white mx-[3px]' })}
            <span className='text-white text-title-lg'>{item.label}</span>
          </Link>
        ))}
      </div>
      {/* 하단 메뉴 */}
      <div className='mt-auto'>
        <Link href='/info' onClick={() => closeModal(modalId)} className='text-white text-body-lg'>
          서비스 소개
        </Link>
        <div className='text-white text-body-lg mt-1'>문의</div>
        <div className='text-primary-100 text-body-sm'>ai.bouquet.maker@gmail.com</div>
      </div>
    </div>
  );
}

export default Sidebar;
