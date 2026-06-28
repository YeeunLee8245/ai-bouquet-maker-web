import { deriveWrapFrontShades } from '@shared/utils/color-derive';

const DEFAULT_CLS1 = '#e8ebef';
const DEFAULT_CLS2 = '#f7f8f9';

type TProps = {
  color?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function BouquetWrapFrontSvg({ color, className, style }: TProps) {
  const [cls1, cls2] = color
    ? deriveWrapFrontShades(color)
    : [DEFAULT_CLS1, DEFAULT_CLS2];

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 296.06 176.88'
      className={className}
      style={style}
    >
      <g>
        <path fill={cls1} d='M147.03,105.94h-22.96c-4.06,10.06-8.4,20.85-8.5,21.32-2.33,10.88-12.2,42.79-12.2,42.79-.04.28.15.55.43.61l18.99,3.74c8.39,1.65,16.91,2.48,25.42,2.48s17.03-.83,25.42-2.48l18.99-3.74c.28-.06.47-.32.43-.61,0,0-9.88-31.92-12.2-42.79-.1-.47-4.44-11.26-8.5-21.32h-25.32Z' />
        <polygon fill={cls2} points='271.14 11.34 234.77 2.89 189.74 88.79 168.82 97.19 148.03 105.54 127.56 97.31 106.33 88.79 61.29 2.89 24.92 11.34 0 0 79.71 96.05 123.04 105.94 124.07 105.94 147.03 105.94 149.03 105.94 172.36 105.94 173.02 105.94 216.35 96.05 296.06 0 271.14 11.34' />
      </g>
    </svg>
  );
}
