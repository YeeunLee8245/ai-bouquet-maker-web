'use client';

import React, { cloneElement } from 'react';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { useSetAtom } from 'jotai';
import UpArrowIcon from '@/shared/assets/icons/up_arrow.svg';
import Link from 'next/link';
import { cn } from '@/shared/utils/styles';
import { usePathname, useRouter } from 'next/navigation';
import { showToastAtom } from '@/shared/model/toast/toast.actions';

export type TNavItem = {
  href: string;
  label: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  isLoginRequired?: boolean;
};

interface ISidebarProps extends TModalProps {
  navItems: TNavItem[];
  isLogin: boolean;
}

function Sidebar({ modalId, navItems, isLogin }: ISidebarProps) {
  const closeModal = useSetAtom(closeModalAtom);
  const showToast = useSetAtom(showToastAtom);
  const router = useRouter();
  const pathname = usePathname();

  const handleClickMenuItem = (href: string, isLoginRequired?: boolean) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === href) {
      e.preventDefault();
      return;
    }
    if (isLoginRequired && !isLogin) {
      e.preventDefault();
      showToast({ message: '로그인이 필요합니다.' });
      router.push(`/login?next=${encodeURIComponent(href)}`);
    }
    closeModal(modalId);
  };

  return (
    <div className='w-[268px] h-[100dvh] bg-primary-400 animate-slide-in-from-right px-7 py-11 flex flex-col'>
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
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleClickMenuItem(item.href, item.isLoginRequired)}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-5 transition-colors hover:bg-primary-300 active:bg-primary-500',
              pathname === item.href ? 'bg-primary-300' : '',
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
        <button type='button' className='flex flex-col items-start'>
          <div className='text-white text-body-lg mt-1'>문의</div>
          <div className='text-primary-100 text-body-sm'>ai.bouquet.maker@gmail.com</div>
        </button>
        <div className='text-primary-100 text-body-sm'>&copy; 2026 꽃다발 레시피</div>
      </div>
    </div>
  );
}

export default Sidebar;
