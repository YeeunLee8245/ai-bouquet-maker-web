import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  override: {
    classGroups: {
      // 커스텀 typography 클래스들을 별도 그룹으로 등록하여 text-* 색상 클래스와 충돌 방지
      'font-size': [
        {
          text: [
            // UI typography
            'ui-tag',
            'ui-placeholder',
            'ui-notice',
            'ui-label-md',
            'ui-label-sm',
            'ui-filter-sm',
            'ui-textbtn-lg',
            'ui-textbtn-md',
            'ui-textbtn-sm',
            'ui-cta-lg',
            'ui-cta-md',
            'ui-cta-sm',
            'ui-step-lg',
            'ui-tap-lg',
            'ui-tap-md',
            'ui-textbtn-md',
            'ui-textbtn-sm',
            // Title typography
            'title-lg',
            'title-md',
            // Body typography
            'body-lg',
            'body-md',
            'body-sm',
            'body-xsm',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: Parameters<typeof clsx>) {
  return customTwMerge(clsx(inputs));
}
