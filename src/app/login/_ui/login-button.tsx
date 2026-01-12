import Link from 'next/link';
import { TLoginProvider } from '../_datas';
import { cloneElement } from 'react';
import { cn } from '@/shared/utils/styles';

type TProps = {
  provider: TLoginProvider;
  className?: string;
};

export function LoginButton({ provider, className }: TProps) {
  const { iconComponent, name, link } = provider;

  return (
    <Link
      href={link}
      className={
        cn(
          'relative w-full h-[48px] px-2 rounded-4 transition',
          className,
        )}>
      {cloneElement(iconComponent, { className: 'absolute top-1/2 -translate-y-1/2' } as React.HTMLAttributes<HTMLElement>)}
      <p className='pb-micro text-body-md w-full h-full text-center content-center'>{name} 로그인</p>
    </Link>
  );
}

export default LoginButton;
