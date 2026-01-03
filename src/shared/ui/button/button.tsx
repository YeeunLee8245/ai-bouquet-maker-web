import { cn } from '@/shared/utils/styles';
import { ButtonHTMLAttributes, forwardRef, isValidElement, cloneElement } from 'react';

type TProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  className?: string;
};

const buttonSizes: Record<TProps['size'], string> = {
  sm: 'py-1 px-2 inline-flex items-center justify-center rounded-3 bg-primary-100 text-ui-cta-sm text-primary-600 hover:bg-primary-400 hover:text-primary-200',
  md: 'w-full h-[32px] py-1 px-2 inline-flex items-center justify-center rounded-3 bg-primary-400 text-ui-cta-md text-white hover:bg-primary-600 hover:text-primary-200',
  lg: 'w-full h-[44px] px-4 inline-flex items-center justify-center rounded-4 bg-primary-400 text-ui-cta-lg text-white hover:bg-primary-600 hover:text-primary-200',
};

const Button = forwardRef<HTMLButtonElement, TProps>(
  ({ children, size, asChild, className, ...props }, ref) => {
    const baseClassName = cn('cursor-pointer', buttonSizes[size], className);

    if (asChild && isValidElement(children)) {
      const childProps = children.props as Record<string, unknown>;
      return cloneElement(
        children,
        {
          ...props,
          ...childProps,
          className: cn(baseClassName, childProps.className as string | undefined),
        } as Record<string, unknown>,
      );
    }

    return (
      <button
        ref={ref}
        className={baseClassName}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
