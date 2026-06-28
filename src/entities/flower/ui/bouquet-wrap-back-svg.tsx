import { deriveWrapBackShades } from '@shared/utils/color-derive';

const DEFAULT_CLS1 = '#e8ebef';
const DEFAULT_CLS2 = '#e2e4e8';

type TProps = {
  color?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function BouquetWrapBackSvg({ color, className, style }: TProps) {
  const [cls1, cls2] = color
    ? deriveWrapBackShades(color)
    : [DEFAULT_CLS1, DEFAULT_CLS2];

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 296.06 230.51'
      className={className}
      style={style}
    >
      <g>
        <polygon fill={cls1} points='277.07 96 296.06 122.92 271.14 134.26 234.77 125.81 277.07 96' />
        <polygon fill={cls1} points='19 96 0 122.92 24.92 134.26 61.29 125.81 19 96' />
        <path fill={cls2} d='M289.05,17.01l-60.22-10.23C202.21,2.26,175.21,0,148.22,0s-54,2.26-80.61,6.78L7.38,17.01c-.89.15-1.49.88-1.36,1.66l16.31,97.19c.41,2.46,1.45,4.82,3.04,6.9l68.53,89.47c6.12,7.63,13.97,12.19,54.31,18.28,40.34-6.09,48.19-10.65,54.31-18.28l68.53-89.47c1.59-2.08,2.63-4.43,3.04-6.9l16.31-97.19c.13-.78-.47-1.5-1.36-1.66Z' />
      </g>
    </svg>
  );
}
