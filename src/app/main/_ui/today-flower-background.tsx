'use client';

import Image from 'next/image';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { BREAKPOINTS } from '@/shared/constants/breakpoints';
import { cn } from '@/shared/utils/styles';

export default function TodayFlowerBackground() {
  const isTabletUp = useMediaQuery(`(min-width: ${BREAKPOINTS.TABLET})`);
  const isPcUp = useMediaQuery(`(min-width: ${BREAKPOINTS.PC})`);

  const src = isPcUp
    ? '/images/bg_main_bottom_pc.webp'
    : isTabletUp
      ? '/images/bg_main_bottom_tablet.webp'
      : '/images/bg_main_bottom_mobile.webp';

  return (
    <Image
      src={src}
      alt='main'
      width={360}
      height={324}
      className={
        cn('absolute bottom-0 left-0 w-full h-[338px] object-cover object-bottom',
          isTabletUp && 'h-[428px]',
        )}
    />
  );
}
