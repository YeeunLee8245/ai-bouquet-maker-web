// ToggleButton
export interface IToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'custom';
  className?: string | undefined;
  onPressedChange: (pressed: boolean) => void;
  children?: React.ReactNode;
}

// TooltipButton
export type TooltipPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface ITooltipButtonProps {
  msg: string;
  position?: TooltipPosition;
}
