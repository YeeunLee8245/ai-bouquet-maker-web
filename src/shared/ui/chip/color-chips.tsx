import { cn } from '@/shared/utils/styles';

type TProps = {
  colors: string[];
  className?: string;
};

/**
 * 꽃의 색상을 작은 칩 형태로 표시하는 컴포넌트
 * 첫 번째 색상이 가장 크고, 이후 색상들은 점점 작아집니다.
 */
function ColorChips({ colors, className }: TProps) {
  return (
    <div className={cn('flex gap-1 items-center', className)}>
      {colors.map((hexColor, idx) => (
        <span
          key={hexColor}
          className={cn(
            'h-4 rounded-1',
            idx === 0 && 'w-4',
            idx === 1 && 'w-[14px]',
            idx === 2 && 'w-[12px]',
            idx >= 3 && 'w-[8px]',
          )}
          style={{ backgroundColor: hexColor }}
        />
      ))}
    </div>
  );
}

export default ColorChips;
