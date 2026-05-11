'use client';

import Image from 'next/image';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { BREAKPOINTS } from '@/shared/constants/breakpoints';
import { cn } from '@/shared/utils/styles';

export default function HeroBackground() {
  const isTabletUp = useMediaQuery(`(min-width: ${BREAKPOINTS.TABLET})`);
  const isPcUp = useMediaQuery(`(min-width: ${BREAKPOINTS.PC})`);

  const src = isPcUp
    ? '/images/bg_main_top_pc.webp'
    : isTabletUp
      ? '/images/bg_main_top_tablet.webp'
      : '/images/bg_main_top_mobile.webp';

  return (
    <Image
      src={src}
      alt=''
      priority
      width={360}
      height={380}
      className={
        cn(
          'absolute inset-0 w-full h-full object-cover object-[50%_-48px]',
          isPcUp && 'object-[50%_-72px]',
        )}
    />
  );
}
