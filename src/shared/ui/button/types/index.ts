// ToggleButton
export interface IToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'custom';
  className?: string | undefined;
  onPressedChange: (pressed: boolean) => () => void;
  children?: React.ReactNode;
}
