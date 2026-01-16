import { cn } from '@/shared/utils/styles';
import { IToggleButtonProps } from './types';

const buttonPrimary: Record<NonNullable<IToggleButtonProps['size']>, string> = {
  sm: 'py-1 px-2 inline-flex items-center justify-center rounded-3 bg-primary-100 text-ui-cta-sm text-primary-600 hover:bg-primary-400 hover:text-primary-200 [&[data-state="on"]]:bg-primary-400 [&[data-state="on"]]:text-primary-200',
  md: 'w-[156px] h-[32px] py-1 px-2 inline-flex items-center justify-center rounded-3 bg-primary-400 text-ui-cta-md text-white hover:bg-primary-600 hover:text-primary-200 [&[data-state="on"]]:bg-primary-600 [&[data-state="on"]]:text-primary-200',
  lg: 'w-full h-[44px] px-4 inline-flex items-center justify-center rounded-4 bg-primary-400 text-ui-cta-lg text-white hover:bg-primary-600 hover:text-primary-200 [&[data-state="on"]]:bg-primary-600 [&[data-state="on"]]:text-primary-200',
};

function ToggleButton({ pressed, size = 'lg', variant = 'primary', className, onPressedChange, children, ...props }: IToggleButtonProps) {
  return (
    <button
      type='button'
      aria-pressed={pressed}
      data-state={pressed ? 'on' : 'off'}
      onClick={() => {onPressedChange(!pressed);}}
      className={cn(
        'cursor-pointer',
        variant === 'primary' ? buttonPrimary[size] : '',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default ToggleButton;
