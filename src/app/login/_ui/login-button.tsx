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
          'relative w-full h-[48px] px-2 border border-gray-100 rounded-4 transition hover:border-primary-400 hover:shadow-sm',
          className,
        )}>
      {cloneElement(iconComponent, { className: 'absolute top-1/2 -translate-y-1/2' } as React.HTMLAttributes<HTMLElement>)}
      <p className='pb-micro text-body-md'>{name}</p>
    </Link>
  );
}

export default LoginButton;
