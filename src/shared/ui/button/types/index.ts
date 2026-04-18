// ToggleButton
export interface IToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'custom';
  className?: string | undefined;
  onPressedChange?: (pressed: boolean) => void;
  children?: React.ReactNode;
}

// TooltipButton
export type { TAnchorPosition as TooltipPosition } from '@/shared/utils/anchor-position';
import type { TAnchorPosition } from '@/shared/utils/anchor-position';

export interface ITooltipButtonProps {
  // TODO: yeeun 반응형 분기 처리 시, size 전달 추가 필요(아이콘 크기, msg 박스 크기, gap 값 결정)
  msg: string;
  position?: TAnchorPosition;
  scrollContainerElement?: HTMLElement | null;
}
