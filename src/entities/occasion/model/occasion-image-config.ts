import type { TOccasion } from './types';

export const OCCASION_IMAGE_CONFIG: Record<
  TOccasion,
  { src: string; width: number; height: number; className: string }
> = {
  birthday_anniversary: { src: '/images/cake.webp', width: 72, height: 96, className: 'w-[72px] h-[96px]' },
  proposal: { src: '/images/propose.webp', width: 58, height: 100, className: 'w-[58px] h-[100px]' },
  new_beginning: { src: '/images/gift.webp', width: 74, height: 78, className: 'w-[74px] h-[78px]' },
  celebration_support: { src: '/images/cheer.webp', width: 90, height: 84, className: 'w-[90px] h-[84px]' },
  comfort_recovery: { src: '/images/comfort.webp', width: 54, height: 96, className: 'w-[54px] h-[96px]' },
  apology: { src: '/images/apple.webp', width: 80, height: 86, className: 'w-[80px] h-[86px]' },
  parents_day: { src: '/images/pink_carnation.webp', width: 80, height: 94, className: 'w-[80px] h-[94px]' },
  teachers_day: { src: '/images/blue_carnation.webp', width: 80, height: 94, className: 'w-[80px] h-[94px]' },
};
