'use client';

import DrawerIcon from '@/shared/assets/icons/drawer.svg';
import { usePathname } from 'next/navigation';
import LogoIcon from '@/shared/assets/icons/logo.svg';
import TitleIcon from '@/shared/assets/icons/title.svg';
import { cn } from '@/shared/utils/styles';
interface IProps {
  variant?: 'primary' | 'default';
}

const containerStyles = (variant: NonNullable<IProps['variant']>) => {
  return {
    primary: 'text-[17px] leading-[20px] font-medium tracking-[-0.34px]',
    default: 'text-[17px] leading-[20px] font-medium tracking-[-0.34px]',
  }[variant];
};

const logoWrapperStyles = (variant: NonNullable<IProps['variant']>) => {
  return {
    primary: '[&>svg:first-child]:fill-white [&>svg:last-child]:fill-white [&>svg:last-child]:stroke-[0.2]',
    default: '[&>svg:first-child]:fill-primary-600 [&>svg:last-child]:fill-primary-600 [&>svg:last-child]:stroke-[0.32]',
  }[variant];
};

function Header({ variant: variantProp }: IProps) {
  const pathname = usePathname();
  const variant = variantProp ?? (pathname === '/main' ? 'primary' : 'default');

  return (
    <header className='relative h-[48px] w-full px-4 py-3 flex justify-between items-center z-header'>
      <span className={
        cn(
          'flex items-center',
          logoWrapperStyles(variant),
        )}>
        <LogoIcon className='ml-[5px] mr-[7.8px] w-[21px] h-[21.8px]' />
        <TitleIcon />
      </span>
      <div className='cursor-pointer'>
        <DrawerIcon className={cn('w-[18px] h-[16px] mx-[3px]', variant === 'primary' ? 'fill-white stroke-white' : 'fill-primary-600 stroke-primary-600')}/>
      </div>
    </header>
  );
}

export default Header;
