import type { TOccasion } from './types';

export const OCCASION_IMAGE_CONFIG: Record<
  TOccasion,
  { src: string; width: number; height: number; className: string }
> = {
  birthday_anniversary: { src: '/images/cake.webp', width: 216, height: 288, className: 'w-[72px] h-[96px]' },
  proposal: { src: '/images/propose.webp', width: 174, height: 300, className: 'w-[58px] h-[100px]' },
  new_beginning: { src: '/images/gift.webp', width: 222, height: 234, className: 'w-[74px] h-[78px]' },
  celebration_support: { src: '/images/cheer.webp', width: 270, height: 252, className: 'w-[90px] h-[84px]' },
  comfort_recovery: { src: '/images/comfort.webp', width: 156, height: 288, className: 'w-[54px] h-[96px]' },
  apology: { src: '/images/apple.webp', width: 240, height: 258, className: 'w-[80px] h-[86px]' },
  parents_day: { src: '/images/pink_carnation.webp', width: 240, height: 282, className: 'w-[80px] h-[94px]' },
  teachers_day: { src: '/images/blue_carnation.webp', width: 240, height: 282, className: 'w-[80px] h-[94px]' },
};
